'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Notification = {
  id: string
  type: string
  read: boolean
  created_at: string
  actor_id: string
  post_id: number | null
  profiles: {
    display_name: string
    handle: string
    avatar_url: string
  } | null
}

export default function Notifications() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      const { data, error } = await supabase
        .from('notifications')
        .select(`
          id, type, read, created_at, actor_id, post_id,
          profiles:actor_id (display_name, handle, avatar_url)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) console.error(error)
      else setNotifications(data as any [])
      setLoading(false)
    }

    loadNotifications()
  }, [router])

  const getMessage = (type: string) => {
    switch (type) {
      case 'like': return 'あなたの投稿に「いいね！」しました'
      case 'follow': return 'あなたをフォローしました'
      case 'dm': return 'あなたにメッセージを送りました'
      default: return '新しい通知があります'
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 min-h-screen bg-white border-x">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.push('/')} className="text-xl p-2 hover:bg-gray-100 rounded-full">←</button>
        <h1 className="text-xl font-bold">通知</h1>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">読込中...</p>
      ) : (
        <ul className="divide-y">
          {notifications.map((n) => (
            <li key={n.id} className={`p-4 hover:bg-gray-50 cursor-pointer ${!n.read ? 'bg-blue-50' : ''}`}
                onClick={() => n.post_id ? router.push(`/`) : null}>
              <div className="flex gap-3">
                <img src={n.profiles?.avatar_url || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm">
                    <span className="font-bold">{n.profiles?.display_name}</span> が {getMessage(n.type)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.created_at).toLocaleString('ja-JP')}
                  </p>
                </div>
              </div>
            </li>
          ))}
          {notifications.length === 0 && (
            <p className="text-center text-gray-500 mt-10">まだ通知はありません</p>
          )}
        </ul>
      )}
    </div>
  )
}