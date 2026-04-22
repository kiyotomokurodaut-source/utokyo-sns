'use client'
import { useRouter } from 'next/navigation'

export default function PrivacyPolicy() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-sm rounded-xl p-6 md:p-10 text-sm text-gray-800 leading-relaxed">
        <h1 className="text-3xl font-bold mb-8 text-center border-b pb-4">プライバシーポリシー</h1>

        <p className="mb-6">
          UTokyo SNS（以下「本サービス」）は、ユーザーの個人情報の重要性を認識し、個人情報の保護に関する法律（以下「個人情報保護法」）を遵守するとともに、以下のプライバシーポリシー（以下「本ポリシー」）に従って、適切な取り扱いと保護に努めます。
        </p>

        {/* 第1条 */}
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-3 border-l-4 border-blue-600 pl-3">1. 取得する情報</h2>
          <p>本サービスは、以下の情報を取得することがあります：</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>アカウント情報：</strong>東京大学のメールアドレス（@u-tokyo.ac.jp / @g.ecc.u-tokyo.ac.jp）、ユーザー名、自己紹介、プロフィール画像</li>
            <li><strong>コンテンツ情報：</strong>投稿されたテキスト、画像、リアクション、通報に関するデータ</li>
            <li><strong>技術的情報：</strong>アクセスログ、IPアドレス、デバイス情報、クッキー（Cookie）技術を利用した識別子</li>
          </ul>
        </section>

        {/* 第2条 */}
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-3 border-l-4 border-blue-600 pl-3">2. 利用目的</h2>
          <p>取得した情報は以下の目的のためにのみ利用します：</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>本人確認および本サービスの円滑な運営・提供</li>
            <li>本サービス内での誹謗中傷、スパム、ドキシング等の規約違反行為の調査および対応</li>
            <li>ユーザーからのお問い合わせへの回答</li>
            <li>サービスの利用状況分析による機能改善</li>
          </ul>
        </section>

        {/* 第3条 */}
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-3 border-l-4 border-blue-600 pl-3">3. 個人情報の第三者提供</h2>
          <p>
            本サービスは、法令に基づく場合を除き、ユーザーの同意を得ることなく個人情報を第三者に提供することはありません。ただし、以下の場合を除きます：
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>人の生命、身体または財産の保護のために必要があり、本人の同意を得ることが困難な場合</li>
            <li>裁判所、警察等の公的機関より法令に基づき開示を求められた場合</li>
          </ul>
        </section>

        {/* 第4条 */}
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-3 border-l-4 border-blue-600 pl-3">4. 外部サービスの利用とCookie</h2>
          <p>
            本サービスでは、ログイン状態の維持等のためにCookieを使用しています。また、以下の外部サービスを利用してデータを管理しています：
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Supabase：</strong>認証基盤およびデータベースの管理</li>
            <li><strong>Vercel：</strong>ウェブサイトのホスティングおよびインフラの運営</li>
          </ul>
          <p className="mt-2">これらのサービスにおけるデータの取り扱いは、各提供元のプライバシーポリシーに従います。</p>
        </section>

        {/* 第5条 */}
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-3 border-l-4 border-blue-600 pl-3">5. 安全管理措置</h2>
          <p>
            本サービスは、個人情報の漏洩、滅失または毀損を防止するため、SSLによる通信の暗号化やアクセス制限の実施など、必要かつ適切なセキュリティ対策を講じています。
          </p>
        </section>

        {/* 第6条 */}
        <section className="mb-10">
          <h2 className="font-bold text-lg mb-3 border-l-4 border-blue-600 pl-3 text-blue-900">6. お問い合わせ・アカウント削除窓口</h2>
          <p>
            ユーザー自身の個人情報の照会、訂正、または<strong>アカウントの完全な削除（退会）</strong>を希望される場合は、以下の窓口までご連絡ください。
          </p>
          
          <div className="mt-4 p-5 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
            <p className="text-center font-bold text-blue-800 text-base mb-2">UTokyo SNS 運営事務局窓口</p>
            <p className="text-center font-mono text-lg text-blue-600 select-all">
              wpdgtgdgwj@gmail.com
            </p>
            <p className="mt-3 text-[11px] text-gray-500 leading-tight">
              ※お問い合わせの際は、本人確認のため、必ず登録済みの東京大学発行のメールアドレスから送信してください。
            </p>
          </div>
        </section>

        <div className="flex flex-col items-center border-t pt-8">
          <p className="text-gray-400 text-xs mb-6">最終更新日: 2026年4月22日</p>
          <button
            onClick={() => router.back()}
            className="w-full md:w-64 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform active:scale-95 shadow-lg"
          >
            同意して戻る
          </button>
        </div>
      </div>
    </div>
  )
}
