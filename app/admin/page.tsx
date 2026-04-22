'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Admin() {
  const router = useRouter()
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: adminRow } = await supabase
      .from('admins').select('user_id').eq('user_id', user.id).single()
    if (!adminRow) { setAllowed(false); setLoading(false); return }
    setAllowed(true)

    const { data, error } = await supabase.rpc('get_all_reports')
    if (error) alert(error.message)
    else setReports(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const resolve = async (reportId: number, action: string) => {
    const { error } = await supabase.rpc('resolve_report', {
      p_report_id: reportId, p_action: action
    })
    if (error) alert(error.message)
    else { alert('処理しました'); load() }
  }

  if (loading) return <div className="p-8">読込中...</div>
  if (!allowed) return <div className="p-8">管理者権限がありません</div>

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">管理者画面</h1>
        <a href="/" className="text-blue-500 underline text-sm">タイムラインへ</a>
      </div>

      <h2 className="text-lg font-bold mb-3">通報一覧 ({reports.length}件)</h2>

      {reports.length === 0 && <p className="text-gray-500">通報はありません</p>}

      <ul className="space-y-3">
        {reports.map(r => (
          <li key={r.id} className="border rounded p-3">
            <div className="text-xs text-gray-500">
              ID:{r.id} | {new Date(r.created_at).toLocaleString('ja-JP')}
            </div>
            <div className="text-sm mt-1">
              種類: <span className="font-bold">{r.target_type}</span>
              {r.target_post_id && ` (投稿 #${r.target_post_id})`}
            </div>
            <div className="text-sm mt-1">
              ステータス: <span className={r.status === 'pending' ? 'text-orange-500' : 'text-gray-500'}>
                {r.status}
              </span>
            </div>
            <div className="mt-2 p-2 bg-gray-50 text-sm">
              <strong>理由:</strong> {r.reason}
            </div>
            {r.status === 'pending' && (
              <div className="mt-2 flex gap-2 flex-wrap">
                {r.target_post_id && (
                  <button onClick={() => resolve(r.id, 'hide')}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                    投稿を非表示
                  </button>
                )}
                <button onClick={() => resolve(r.id, 'resolve')}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm">
                  対応済み
                </button>
                <button onClick={() => resolve(r.id, 'dismiss')}
                  className="bg-gray-500 text-white px-3 py-1 rounded text-sm">
                  却下
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
