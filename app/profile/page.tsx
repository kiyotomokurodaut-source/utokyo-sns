'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Profile() {
  const router = useRouter()
  const [handle, setHandle] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [faculty, setFaculty] = useState('')
  const [grade, setGrade] = useState<number>(1)
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [hasProfile, setHasProfile] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserId(user.id)
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (data) {
        setHandle(data.handle || '')
        setDisplayName(data.display_name || '')
        setFaculty(data.faculty || '')
        setGrade(data.grade || 1)
        setBio(data.bio || '')
        setAvatarUrl(data.avatar_url || '')
        setHasProfile(true)
      }
      setLoading(false)
    }
    load()
  }, [router])

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = e.target.files?.[0]
      if (!file) return
      if (!userId) throw new Error('ログインしてください')
      if (file.size > 5 * 1024 * 1024) throw new Error('画像は5MB以下にしてください')

      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
      setAvatarUrl(data.publicUrl)
    } catch (error: any) {
      alert('画像アップロードエラー: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const save = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return setMsg('ログインしてください')

    const profileData = {
      id: user.id,
      handle,
      display_name: displayName,
      faculty,
      grade,
      bio,
      avatar_url: avatarUrl
    }

    const { error } = hasProfile
      ? await supabase.from('profiles').update(profileData).eq('id', user.id)
      : await supabase.from('profiles').insert(profileData)

    if (error) {
      setMsg('エラー: ' + error.message)
    } else {
      setMsg('保存しました')
      setHasProfile(true)
      setTimeout(() => router.push('/'), 1000)
    }
  }

  if (loading) return <div className="p-8">読込中...</div>

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">プロフィール {hasProfile ? '編集' : '作成'}</h1>

      <div className="mb-4 flex flex-col items-center">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover mb-2 border" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 mb-2 border flex items-center justify-center text-gray-400">画像なし</div>
        )}
        <label className="bg-gray-100 px-3 py-1 rounded cursor-pointer text-sm">
          {uploading ? 'アップロード中...' : '画像を選択'}
          <input type="file" accept="image/*" onChange={uploadAvatar} disabled={uploading} className="hidden" />
        </label>
      </div>

      <label className="block text-sm mb-1">ハンドル (英数字, 2-20文字)</label>
      <input className="border p-2 w-full mb-3" value={handle} onChange={e => setHandle(e.target.value)} placeholder="taro_t" />

      <label className="block text-sm mb-1">表示名</label>
      <input className="border p-2 w-full mb-3" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="太郎" />

      <label className="block text-sm mb-1">学部</label>
      <input className="border p-2 w-full mb-3" value={faculty} onChange={e => setFaculty(e.target.value)} placeholder="工学部" />

      <label className="block text-sm mb-1">学年</label>
      <input type="number" min={1} max={6} className="border p-2 w-full mb-3" value={grade} onChange={e => setGrade(Number(e.target.value))} />

      <label className="block text-sm mb-1">自己紹介 (200文字以内)</label>
      <textarea className="border p-2 w-full mb-3" value={bio} onChange={e => setBio(e.target.value)} maxLength={200} />

      <button onClick={save} className="bg-blue-500 text-white font-bold p-2 w-full rounded mt-2">
        {hasProfile ? '更新' : '作成'}
      </button>
      <p className="mt-2 text-center text-sm text-red-500">{msg}</p>
    </div>
  )
}
