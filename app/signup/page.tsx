'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    setMsg(error ? error.message : '確認メールを送信しました')
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">登録 (東大メアドのみ)</h1>
      <input className="border p-2 w-full mb-2" placeholder="example@g.ecc.u-tokyo.ac.jp"
        value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" className="border p-2 w-full mb-2" placeholder="パスワード"
        value={password} onChange={e => setPassword(e.target.value)} />
      <button className="bg-blue-500 text-white p-2 w-full" onClick={handleSignup}>登録</button>
      <p className="mt-2">{msg}</p>
    </div>
  )
}
