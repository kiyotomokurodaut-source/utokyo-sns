'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Signup() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const signup = async () => {
    if (!agreed) {
      return setMsg('利用規約に同意してください')
    }
    if (password.length < 8) {
      return setMsg('パスワードは8文字以上にしてください')
    }

    setLoading(true)
    const { error, data } = await supabase.auth.signUp({ email, password })
    if (error) {
      setMsg(error.message)
      setLoading(false)
      return
    }

    // 利用規約同意を記録
    if (data.user) {
      await supabase.rpc('agree_to_terms', { terms_version: '1.0' })
    }

    setMsg('登録完了。確認メールを送信しました。メール内のリンクをクリックしてください。')
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">登録 (東大メアドのみ)</h1>

      <input
        className="border p-2 w-full mb-3 rounded"
        type="email"
        placeholder="xxxx@u-tokyo.ac.jp"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-3 rounded"
        type="password"
        placeholder="パスワード (8文字以上)"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <label className="flex items-start gap-2 mb-4 text-sm">
        <input
          type="checkbox"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
          className="mt-1"
        />
        <span>
          <a href="/terms" target="_blank" className="text-blue-500 underline">利用規約</a> を読み、同意しました
        </span>
      </label>

      <button
        onClick={signup}
        disabled={loading || !agreed}
        className="bg-blue-500 text-white font-bold p-2 w-full rounded disabled:opacity-50"
      >
        {loading ? '登録中...' : '登録'}
      </button>
      <p className="mt-2 text-center text-sm text-red-500">{msg}</p>

      <div className="mt-4 text-center text-sm">
        <a href="/login" className="text-blue-500 underline">既にアカウントがある方はログイン</a>
      </div>
    </div>
  )
}
