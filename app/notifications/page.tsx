'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Notifications() {
  const [notifs, setNotifs] = useState<any[]>([])

  const load = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('id, type, read, created_at, posts(body), profiles!source_user_id(handle, display_name)')
      .order('created_at', { ascending: false })
      .limit(50)
    setNotifs(data || [])

    // 既読化
    const unreadIds = (data || []).filter((n: any) => !n.read).map((n: any) => n.id)
    if (unreadIds.length > 0) {
      await supabase.from('notifications').update({ read: true }).in('id', unreadIds)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">通知</h1>
      <ul className="space-y-2">
        {notifs.length === 0 && <li className="text-gray-500">通知はありません</li>}
        {notifs.map(n => (
          <li key={n.id} className={`border-b py-2 ${!n.read ? 'bg-blue-50' : ''}`}>
            <div className="text-sm">
              <span className="font-bold">@{n.profiles?.handle}</span>
              {n.type === 'mention' && ' があなたをメンションしました'}
              {n.type === 'like' && ' があなたの投稿にいいねしました'}
              {n.type === 'reply' && ' があなたに返信しました'}
            </div>
            {n.posts?.body && <div className="text-gray-600 text-sm mt-1">{n.posts.body}</div>}
          </li>
        ))}
      </ul>
    </div>
  )
}
