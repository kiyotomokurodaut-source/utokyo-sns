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
    const { data } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId)
    setMyFollows(data?.map(f => f.following_id) || [])
  }

  const search = async () => {
    if (!query.trim()) return
    const { data } = await supabase
      .from('profiles')
      .select('id, handle, display_name, faculty, grade')
      .or(`handle.ilike.%${query}%,display_name.ilike.%${query}%`)
      .limit(20)
    setResults(data || [])
  }

  const toggleFollow = async (targetId: string) => {
    if (!user) return alert('ログインしてください')
    if (myFollows.includes(targetId)) {
      await supabase.from('follows').delete()
        .eq('follower_id', user.id).eq('following_id', targetId)
      setMyFollows(myFollows.filter(id => id !== targetId))
    } else {
      await supabase.from('follows').insert({
        follower_id: user.id,
        following_id: targetId,
      })
      setMyFollows([...myFollows, targetId])
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ユーザー検索</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1 rounded"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="ハンドル/名前で検索"
        />
        <button onClick={search} className="bg-blue-500 text-white px-4 rounded">
          検索
        </button>
      </div>
      <ul className="space-y-2">
        {results.map(p => (
          <li key={p.id} className="border-b py-2 flex justify-between items-center">
            <div>
              <div className="font-bold">@{p.handle}</div>
              <div className="text-sm text-gray-600">
                {p.display_name} · {p.faculty} {p.grade}年
              </div>
            </div>
            {user && p.id !== user.id && (
              <button
                onClick={() => toggleFollow(p.id)}
                className={`px-3 py-1 rounded text-sm ${
                  myFollows.includes(p.id)
                    ? 'bg-gray-200 text-gray-700'
                    : 'bg-blue-500 text-white'
                }`}
              >
                {myFollows.includes(p.id) ? 'フォロー解除' : 'フォロー'}
              </button>
            )}
          </li>
        ))}
        {query && results.length === 0 && (
          <p className="text-gray-500">ユーザーが見つかりません</p>
        )}
      </ul>
    </div>
  )
}
