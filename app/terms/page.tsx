'use client'
import { useRouter } from 'next/navigation'

export default function Terms() {
  const router = useRouter()
  return (
    <div className="max-w-xl mx-auto p-4 text-sm">
      <h1 className="text-2xl font-bold mb-4">利用規約</h1>

      <section className="mb-4">
        <h2 className="font-bold mb-1">第1条 (目的)</h2>
        <p>本規約は、UTokyo SNS (以下「本サービス」) の利用条件を定めるものです。本サービスは東京大学に在籍する学生および関係者のための交流プラットフォームです。</p>
      </section>

      <section className="mb-4">
        <h2 className="font-bold mb-1">第2条 (登録資格)</h2>
        <p>本サービスは東京大学のメールアドレス (@u-tokyo.ac.jp) を保有する者のみ登録可能です。虚偽の情報や他人のメールアドレスを使用した登録は禁止します。</p>
      </section>

      <section className="mb-4">
        <h2 className="font-bold mb-1">第3条 (禁止事項)</h2>
        <p>以下の行為を禁止します:</p>
        <ul className="list-disc pl-5">
          <li>他人を誹謗中傷、脅迫、差別する行為</li>
          <li>わいせつ、暴力的、または違法な内容の投稿</li>
          <li>スパム、広告、勧誘行為</li>
          <li>他人になりすます行為</li>
          <li>個人情報を無断で公開する行為 (ドキシング)</li>
          <li>システムへの不正アクセスや攻撃</li>
          <li>本サービスを商業目的で利用する行為</li>
          <li>法令、公序良俗に反する一切の行為</li>
        </ul>
      </section>

      <section className="mb-4">
        <h2 className="font-bold mb-1">第4条 (投稿コンテンツ)</h2>
        <p>ユーザーは自身の投稿に責任を負います。運営者は禁止事項に該当する投稿を予告なく削除、または投稿者のアカウントを停止することがあります。3件以上の通報を受けた投稿は自動的に非表示になります。</p>
      </section>

      <section className="mb-4">
        <h2 className="font-bold mb-1">第5条 (免責事項)</h2>
        <p>運営者は本サービスの内容、提供の継続、またユーザー間のトラブルについて一切の責任を負いません。本サービスはユーザーの自己責任で利用するものとします。</p>
      </section>

      <section className="mb-4">
        <h2 className="font-bold mb-1">第6条 (プライバシー)</h2>
        <p>運営者はユーザーの個人情報を適切に取り扱います。ただし、法令に基づく要請または重大な規約違反の調査のため、必要な範囲で情報を開示することがあります。</p>
      </section>

      <section className="mb-4">
        <h2 className="font-bold mb-1">第7条 (アカウント停止)</h2>
        <p>本規約に違反した場合、運営者は予告なくアカウントを停止または削除する権利を有します。停止されたユーザーは異議申し立てをする権利がありますが、最終決定は運営者に委ねられます。</p>
      </section>

      <section className="mb-4">
        <h2 className="font-bold mb-1">第8条 (規約の変更)</h2>
        <p>本規約は必要に応じて変更されることがあります。変更後、継続してサービスを利用した場合、変更に同意したものとみなします。</p>
      </section>

      <section className="mb-6">
        <h2 className="font-bold mb-1">第9条 (準拠法)</h2>
        <p>本規約の解釈は日本法に準拠するものとします。</p>
      </section>

      <p className="text-gray-500 text-xs">最終更新日: 2026年4月</p>

      <button
        onClick={() => router.back()}
        className="mt-4 bg-gray-200 px-4 py-2 rounded w-full"
      >
        戻る
      </button>
    </div>
  )
}
