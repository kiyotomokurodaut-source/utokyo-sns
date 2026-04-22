'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Post = {
  id: number
  body: string
  image_url?: string | null
  user_id: string
  created_at: string
  profiles: { handle: string; display_name: string; avatar_url?: string } | null
  likes: { user_id: string }[]
  liked_by_me: boolean
  like_count: number
}

export default function Home() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [body, setBody] = useState('')
  const [user, setUser] = useState<any>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('posts')
      .select('id, body, image_url, user_id, created_at, profiles(handle, display_name, avatar_url), likes(user_id)')
      .order('created_at', { ascending: false })
      .limit(50)

    const enriched = (data || []).map((p: any) => ({
      ...p,
      like_count: p.likes?.length || 0,
      liked_by_me: user ? p.likes?.some((l: any) => l.user_id === user.id) : false,
    }))
    setPosts(enriched)
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    load()
  }, [])

  const post = async () => {
    if (!user) return alert('ログインしてください')
    if (!body.trim() && !file) return alert('本文または画像を入力してください')
    setUploading(true)

    let imageUrl: string | null = null

    if (file) {
      // ファイルサイズチェック (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('画像は5MB以下にしてください')
        setUploading(false)
        return
      }

      const ext = file.name.split('.').pop()
      const path = `${user.id}/${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from('posts')
        .upload(path, file)

      if (uploadErr) {
        alert('画像アップロード失敗: ' + uploadErr.message)
        setUploading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('posts')
        .getPublicUrl(path)
      imageUrl = urlData.publicUrl
    }

    const { error } = await supabase.rpc('create_post_with_image', {
      post_body: body,
      image_url: imageUrl,
    })

    if (error) {
      alert(error.message)
    } else {
      setBody('')
      setFile(null)
      load()
    }
    setUploading(false)
  }

  const toggleLike = async (postId: number) => {
    if (!user) return alert('ログインしてください')
    const { error } = await supabase.rpc('toggle_like', { target_post_id: postId })
    if (error) alert(error.message)
    else load()
  }

  const deletePost = async (postId: number) => {
    if (!confirm('本当に削除しますか?')) return
    const { error } = await supabase.rpc('delete_my_post', { target_post_id: postId })
    if (error) alert(error.message)
    else load()
  }

  const editPost = async (postId: number, currentBody: string) => {
    const newBody = prompt('新しい本文 (投稿後15分以内のみ):', currentBody)
    if (!newBody || newBody === currentBody) return
    const { error } = await supabase.rpc('edit_my_post', {
      target_post_id: postId,
      new_body: newBody,
    })
    if (error) alert(error.message)
    else load()
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/login')
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">UTokyo SNS</h1>
        <div className="text-sm flex items-center gap-3">
          {user ? (
            <>
              <a href="/search" className="text-blue-500 underline">検索</a>
              <a href="/profile" className="text-blue-500 underline">プロフィール</a>
              <button onClick={logout} className="text-gray-500 underline">ログアウト</button>
            </>
          ) : (
            <>
              <a href="/login" className="text-blue-500 underline">ログイン</a>
              <a href="/signup" className="text-blue-500 underline">登録</a>
            </>
          )}
        </div>
      </div>

      {user && (
        <div className="mb-4 border rounded-lg p-3">
          <textarea 
            className="border w-full p-2 rounded" 
            value={body}
            onChange={e => setBody(e.target.value)} 
            maxLength={500}
            placeholder="いまどうしてる?" 
            rows={3} 
          />
          {file && (
            <div className="mt-2 text-sm text-gray-600">
              📎 {file.name}
              <button 
                onClick={() => setFile(null)} 
                className="ml-2 text-red-500"
              >
                ✕
              </button>
            </div>
          )}
          <div className="mt-2 flex items-center justify-between">
            <label className="cursor-pointer text-blue-500 text-sm">
              📷 画像
              <input 
                type="file" 
                accept="image/*"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="hidden" 
              />
            </label>
            <button 
              onClick={post} 
              disabled={uploading}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {uploading ? '送信中…' : '投稿'}
            </button>
          </div>
        </div>
      )}

      <ul className="space-y-2">
        {posts.length === 0 && <li className="text-gray-500">まだ投稿がありません</li>}
        {posts.map(p => (
          <li key={p.id} className="border-b py-3">
            <div className="text-sm text-gray-500 mb-1">
              @{p.profiles?.handle} ({p.profiles?.display_name})
            </div>
            {p.body && <div className="whitespace-pre-wrap mb-2">{p.body}</div>}
            {p.image_url && (
              <img 
                src={p.image_url} 
                alt="" 
                className="mt-2 rounded-lg max-h-96 border"
              />
            )}
            <div className="flex gap-4 text-sm text-gray-600 mt-2">
              <button
                onClick={() => toggleLike(p.id)}
                className={`hover:text-red-500 ${p.liked_by_me ? 'text-red-500' : ''}`}
              >
                {p.liked_by_me ? '♥' : '♡'} {p.like_count}
              </button>
              {user && p.user_id === user.id && (
                <>
                  <button 
                    onClick={() => editPost(p.id, p.body)}
                    className="text-blue-500 hover:underline"
                  >
                    編集
                  </button>
                  <button 
                    onClick={() => deletePost(p.id)}
                    className="text-red-500 hover:underline"
                  >
                    削除
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
