// サンプルデータ（架空の選手・大会です）
// 将来的にはAPI / DBから取得する想定。Store(js/store.js) がこの形式を読み込みます。
//
// results の形式: { 階級ID: { 腕(R/L): [1位, 2位, 3位, 4位] } }
//   4名トーナメントとして自動で試合を生成します:
//   準決勝1: 1位 vs 4位 / 準決勝2: 2位 vs 3位 / 3位決定戦: 3位 vs 4位 / 決勝: 1位 vs 2位
//
// videos の形式: { 試合ID: { url: 'https://www.youtube.com/watch?v=XXXXXXXXXXX', start: 秒 } }
//   試合ID は "大会ID-階級ID-腕-ラウンド"（例: t1-M70-R-F）。ラウンドは SF1 / SF2 / 3P / F。
//   画面の「動画を登録」から追加した動画はブラウザ(localStorage)に保存され、
//   「登録動画をエクスポート」で出力したJSONをここに貼り付けると全員に反映できます。
window.AW_DATA = {
  classes: [
    { id: 'M70', name: '男子 -70kg' },
    { id: 'M80', name: '男子 -80kg' },
    { id: 'W60', name: '女子 -60kg' },
  ],

  athletes: [
    { id: 'a1', name: '佐藤 剛', nameEn: 'Tsuyoshi Sato', pref: '東京都', team: 'TEAM IRON', classId: 'M70', dominant: 'R', since: 2015, bio: 'トップロールを得意とするスピード型。東日本の常連優勝候補。' },
    { id: 'a2', name: '鈴木 拓海', nameEn: 'Takumi Suzuki', pref: '神奈川県', team: '湘南アームクラブ', classId: 'M70', dominant: 'R', since: 2018, bio: 'フックでの粘り強さに定評。2026年全日本右腕王者。' },
    { id: 'a3', name: '高橋 誠', nameEn: 'Makoto Takahashi', pref: '埼玉県', team: 'GRIP FACTORY', classId: 'M70', dominant: 'L', since: 2012, bio: 'サウスポーのベテラン。左腕での安定感は国内屈指。' },
    { id: 'a4', name: '田中 健太', nameEn: 'Kenta Tanaka', pref: '千葉県', team: 'TEAM IRON', classId: 'M70', dominant: 'R', since: 2020, bio: '急成長中の若手。2026年秋季オープンで右腕準優勝。' },
    { id: 'a5', name: '伊藤 大輔', nameEn: 'Daisuke Ito', pref: '大阪府', team: '浪速腕相撲道場', classId: 'M80', dominant: 'R', since: 2010, bio: '-80kg級の絶対王者。圧倒的なサイドプレッシャー。' },
    { id: 'a6', name: '渡辺 翔', nameEn: 'Sho Watanabe', pref: '兵庫県', team: 'KOBE ARMS', classId: 'M80', dominant: 'L', since: 2016, bio: '左腕で無敗街道を走る。右腕でも上位進出が増加中。' },
    { id: 'a7', name: '山本 隆', nameEn: 'Takashi Yamamoto', pref: '愛知県', team: '名古屋アームファイターズ', classId: 'M80', dominant: 'R', since: 2014, bio: '地元名古屋で右腕初優勝を達成。' },
    { id: 'a8', name: '中村 亮', nameEn: 'Ryo Nakamura', pref: '京都府', team: '浪速腕相撲道場', classId: 'M80', dominant: 'R', since: 2019, bio: 'パワー型のファイター。スタートの速さが武器。' },
    { id: 'a9', name: '小林 美咲', nameEn: 'Misaki Kobayashi', pref: '東京都', team: 'TEAM IRON', classId: 'W60', dominant: 'R', since: 2017, bio: '女子-60kg級の右腕エース。' },
    { id: 'a10', name: '加藤 由衣', nameEn: 'Yui Kato', pref: '静岡県', team: 'GRIP FACTORY', classId: 'W60', dominant: 'R', since: 2019, bio: '全日本右腕女王。テクニカルなフックが持ち味。' },
    { id: 'a11', name: '吉田 葵', nameEn: 'Aoi Yoshida', pref: '福岡県', team: '博多アームズ', classId: 'W60', dominant: 'L', since: 2016, bio: '左腕2連覇の実力者。' },
    { id: 'a12', name: '山田 彩', nameEn: 'Aya Yamada', pref: '宮城県', team: '杜の都AWC', classId: 'W60', dominant: 'R', since: 2021, bio: '秋季オープンで左腕初優勝。今季のブレイク選手。' },
  ],

  tournaments: [
    {
      id: 't1', name: '2026 東日本アームレスリング選手権', short: '東日本選手権', date: '2026-04-19',
      venue: '東京都・墨田区総合体育館', level: '地方大会',
      results: {
        M70: { R: ['a1', 'a2', 'a4', 'a3'], L: ['a3', 'a1', 'a2', 'a4'] },
        M80: { R: ['a5', 'a7', 'a8', 'a6'], L: ['a6', 'a5', 'a8', 'a7'] },
        W60: { R: ['a9', 'a10', 'a12', 'a11'], L: ['a11', 'a9', 'a10', 'a12'] },
      },
    },
    {
      id: 't2', name: '2026 全日本アームレスリング選手権', short: '全日本選手権', date: '2026-07-12',
      venue: '大阪府・エディオンアリーナ大阪', level: '全国大会',
      results: {
        M70: { R: ['a2', 'a1', 'a3', 'a4'], L: ['a3', 'a4', 'a1', 'a2'] },
        M80: { R: ['a5', 'a8', 'a7', 'a6'], L: ['a6', 'a7', 'a5', 'a8'] },
        W60: { R: ['a10', 'a9', 'a11', 'a12'], L: ['a11', 'a12', 'a9', 'a10'] },
      },
    },
    {
      id: 't3', name: '2026 秋季アームレスリングオープン', short: '秋季オープン', date: '2026-09-27',
      venue: '愛知県・名古屋市総合体育館', level: 'オープン大会',
      results: {
        M70: { R: ['a1', 'a4', 'a2', 'a3'], L: ['a1', 'a3', 'a4', 'a2'] },
        M80: { R: ['a7', 'a5', 'a6', 'a8'], L: ['a6', 'a5', 'a7', 'a8'] },
        W60: { R: ['a9', 'a12', 'a10', 'a11'], L: ['a12', 'a11', 'a9', 'a10'] },
      },
    },
  ],

  videos: {
    // 't3-M70-R-F': { url: 'https://www.youtube.com/watch?v=XXXXXXXXXXX', start: 0 },
  },
};
