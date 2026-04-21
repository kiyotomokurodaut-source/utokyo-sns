'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'

export default function DM() {
  const params = useParams()
  const router = useRouter()
  const convId = params.convId as string
  
  const [messages, setMessages] = useState<any[]>([])
  const [body, setBody] = useState('')
  const [myId, setMyId] = useState<string | null>(null)

  const loadMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('id, body, sender_id, created_at, profiles(handle, display_name, avatar_url)')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true }) 
    setMessages(data || [])
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else setMyId(user.id)
    })
    
    loadMessages()

    const channel = supabase
      .channel(`room-${convId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${convId}` }, 
        () => {
          loadMessages() 
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [convId, router])

  const send = async () => {
    if (!body.trim()) return
    const { error } = await supabase.from('messages').insert({
      conversation_id: Number(convId),
      sender_id: myId,
      body
    })
    if (error) alert(error.message)
    else setBody('')
  }

  return (
    <div className="max-w-xl mx-auto p-4 flex flex-col h-screen">
      <div className="flex items-center mb-4 border-b pb-2">
        <button onClick={() => router.push('/')} className="text-blue-500 mr-4">← 戻る</button>
        <h1 className="text-xl font-bold">ダイレクトメッセージ</h1>
      </div>

      <ul className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map(m => {
          const isMe = m.sender_id === myId
          return (
            <li key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-lg p-3 ${isMe ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                {!isMe && <div className="text-xs text-gray-500 mb-1">{m.profiles?.display_name}</div>}
                <div className="whitespace-pre-wrap">{m.body}</div>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="flex gap-2 pb-4">
        <input 
          className="border rounded p-2 flex-1" 
          value={body}
          onChange={e => setBody(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="メッセージを入力..." 
        />
        <button onClick={send} className="bg-blue-500 text-white px-4 rounded font-bold hover:bg-blue-600">
          送信
        </button>
      </div>
    </div>
  )
}