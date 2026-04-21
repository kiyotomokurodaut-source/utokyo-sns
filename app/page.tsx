'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Post = {
  id: number; body: string; image_url?: string; video_url?: string; user_id: string; created_at: string;
  profiles: { handle: string; display_name: string; avatar_url: string } | null;
  likes: { user_id: string }[]; liked_by_me: boolean; like_count: number;
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
    const { data, error } = await supabase
      .from('posts')
      .select('id, body, image_url, video_url, created_at, user_id, profiles!posts_user_id_fkey(handle, display_name, avatar_url), likes(user_id)')
      .order('created_at', { ascending: false }).limit(50)

    if (error) return console.error(error)
    const enriched = (data || []).map((p: any) => ({
      ...p, like_count: p.likes?.length || 0,
      liked_by_me: user ? p.likes?.some((l: any) => l.user_id === user.id) : false,
    }))
    setPosts(enriched)
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => { setUser(user); load() })
  }, [])

  const handlePost = async () => {
    if (!user) return alert('ログインしてください')
    if (!body.trim() && !file) return alert('文字を入力するか画像を選択してください')
    try {
      setUploading(true); let imageUrl = '', videoUrl = ''
      if (file) {
        const fileName = `${Math.random()}.${file.name.split('.').pop()}`
        await supabase.storage.from('post_attachments').upload(fileName, file)
        const { data } = supabase.storage.from('post_attachments').getPublicUrl(fileName)
        file.type.startsWith('video/') ? videoUrl = data.publicUrl : imageUrl = data.publicUrl
      }
      await supabase.from('posts').insert({ user_id: user.id, body, image_url: imageUrl, video_url: videoUrl })
      setBody(''); setFile(null); load()
    } catch (e: any) { alert(e.message) } finally { setUploading(false) }
  }

  const toggleLike = async (p: Post) => {
    if (!user) return alert('ログインしてください')
    p.liked_by_me ? await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', p.id)
                  : await supabase.from('likes').insert({ user_id: user.id, post_id: p.id })
    load()
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-white min-h-screen border-x">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-black text-blue-500">UTokyo SNS</h1>
          <a href="/search" className="text-xl p-2 hover:bg-gray-100 rounded-full">🔍</a>
        </div>
        <div className="text-sm space-x-3 flex items-center">
          {user ? (
            <><a href="/profile" className="hover:underline">プロフ</a>
              <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="text-gray-400">ログアウト</button>
            </>
          ) : <a href="/login" className="text-blue-500 font-bold">ログイン</a>}
        </div>
      </div>

      {user && (
        <div className="mb-8 border-b pb-4">
          <textarea className="w-full p-2 text-lg outline-none resize-none" value={body} onChange={e => setBody(e.target.value)} placeholder="東大でいまどうしてる？" rows={3} />
          {file && (
            <div className="relative mt-2">
              <button onClick={() => setFile(null)} className="absolute top-1 left-1 bg-black/50 text-white rounded-full w-6 h-6 text-xs z-10">✕</button>
              {file.type.startsWith('video/') ? <video src={URL.createObjectURL(file)} className="max-h-60 rounded-xl" /> : <img src={URL.createObjectURL(file)} className="max-h-60 rounded-xl object-cover" />}
            </div>
          )}
          <div className="flex justify-between items-center mt-3 border-t pt-3">
            <label className="cursor-pointer text-blue-500 hover:bg-blue-50 p-2 rounded-full transition">
              <span className="text-xl">🖼️</span>
              <input type="file" accept="image/*,video/*" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" />
            </label>
            <button onClick={handlePost} disabled={uploading} className="bg-blue-500 text-white font-bold px-6 py-2 rounded-full hover:bg-blue-600 disabled:opacity-50">
              {uploading ? '送信中...' : '投稿する'}
            </button>
          </div>
        </div>
      )}

      <ul className="divide-y">
        {posts.map(p => (
          <li key={p.id} className="py-4 hover:bg-gray-50 transition px-2">
            <div className="flex gap-3">
              <img src={p.profiles?.avatar_url || 'https://via.placeholder.com/40'} className="w-12 h-12 rounded-full object-cover border" />
              <div className="flex-1">
                <div className="flex items-center gap-1"><span className="font-bold">{p.profiles?.display_name}</span><span className="text-gray-500 text-sm">@{p.profiles?.handle}</span></div>
                <p className="mt-1 whitespace-pre-wrap">{p.body}</p>
                {p.image_url && <img src={p.image_url} className="mt-3 rounded-2xl max-h-80 w-full object-cover border" />}
                {p.video_url && <video src={p.video_url} controls className="mt-3 rounded-2xl max-h-80 w-full border" />}
                <div className="flex gap-8 mt-4 text-gray-500">
                  <button onClick={() => toggleLike(p)} className={p.liked_by_me ? 'text-red-500' : 'hover:text-red-500'}>{p.liked_by_me ? '❤️' : '🤍'} {p.like_count}</button>
                  {user?.id !== p.user_id && <button onClick={async () => {
                    const { data: c } = await supabase.rpc('get_or_create_conversation', { target_user_id: p.user_id });
                    router.push(`/dm/${c}`)
                  }} className="hover:text-blue-500">✉️ DM</button>}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}