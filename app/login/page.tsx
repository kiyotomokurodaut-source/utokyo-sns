'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setMsg(error.message)
    } else {
      router.push('/profile')
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">ログイン</h1>
      <input className="border p-2 w-full mb-2" placeholder="メアド"
        value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" className="border p-2 w-full mb-2" placeholder="パスワード"
        value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 w-full">
        ログイン
      </button>
      <p className="mt-2">{msg}</p>
      <p className="mt-4 text-sm">
        アカウント未登録? <a href="/signup" className="text-blue-500 underline">登録へ</a>
      </p>
    </div>
  )
}
