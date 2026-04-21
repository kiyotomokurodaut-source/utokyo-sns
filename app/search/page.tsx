'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Search() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [myFollows, setMyFollows] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) loadMyFollows(user.id)
    })
  }, [])

  const loadMyFollows = async (userId: string) => {
    const { data } = await supabase.from('follows').select('following_id').eq('follower_id', userId)
    setMyFollows(data?.map(f => f.following_id) || [])
  }

  const handleSearch = async () => {
    if (!query.trim()) return
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .or(`handle.ilike.%${query}%,display_name.ilike.%${query}%,faculty.ilike.%${query}%`)
      .limit(20)
    setResults(data || [])
  }

  const toggleFollow = async (targetId: string) => {
    if (!user) return
    const isFollowing = myFollows.includes(targetId)

    if (isFollowing) {
      await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', targetId)
      setMyFollows(myFollows.filter(id => id !== targetId))
    } else {
      await supabase.from('follows').insert({ follower_id: user.id, following_id: targetId })
      setMyFollows([...myFollows, targetId])
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 min-h-screen bg-white">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.push('/')} className="text-2xl">←</button>
        <input 
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none border focus:border-blue-500"
          placeholder="名前、学部、@ハンドルで検索"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <ul className="divide-y">
        {results.map(p => (
          <li key={p.id} className="py-4 flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <img src={p.avatar_url || 'https://via.placeholder.com/50'} className="w-12 h-12 rounded-full object-cover border" />
              <div>
                <div className="font-bold">{p.display_name}</div>
                <div className="text-gray-500 text-sm">@{p.handle} · {p.faculty}</div>
              </div>
            </div>
            {user && user.id !== p.id && (
              <button 
                onClick={() => toggleFollow(p.id)}
                className={`px-4 py-1 rounded-full font-bold text-sm border ${
                  myFollows.includes(p.id) ? 'bg-white text-black border-gray-300' : 'bg-black text-white border-black'
                }`}
              >
                {myFollows.includes(p.id) ? 'フォロー解除' : 'フォロー'}
              </button>
            )}
          </li>
        ))}
        {query && results.length === 0 && <p className="text-center text-gray-500 mt-10">ユーザーが見つかりませんでした</p>}
      </ul>
    </div>
  )
}