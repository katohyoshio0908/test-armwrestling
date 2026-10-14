// サンプルデータ（架空の選手・大会です）
// 将来的にはAPI / DBから取得する想定。Store(js/store.js) がこの形式を読み込みます。
//
// ■ 大会 tournaments[]
//   weighIns  : 大会ごとの計量体重 { 選手ID: kg }
//   divisions : 部門（階級 × 腕）ごとの試合形式と出場者
//     format  : 'double' = トーナメント（本戦 → 敗者復活戦 → 決勝）
//               'league' = リーグ戦（予選リーグ → 上位2名で決勝）
//     entries : 出場選手（シード順）
//     matches : 試合結果。省略時は js/sample-gen.js がサンプル結果を自動生成します。
//               実データは次の形式で書いてください:
//               { id: 't1-M70-R-W1-1', round: 'W', no: 1, slot: 1, a: 'a01', b: 'a10', winner: 'a01', method: 'ピン勝ち' }
//               round は下の rounds の id、no は回戦（本戦・敗者復活戦・予選のみ）、slot はその回戦内の番号。
//
// ■ 動画 videos
//   { 試合ID: { url: 'https://www.youtube.com/watch?v=XXXXXXXXXXX', start: 秒 } }
//   画面の「動画を登録」から追加した動画はブラウザ(localStorage)に保存され、
//   「登録動画をエクスポート」で出力したJSONをここに貼り付けると全員に反映できます。
window.AW_DATA = {
  classes: [
    { id: 'M70', name: '男子 -70kg', limit: 70 },
    { id: 'M80', name: '男子 -80kg', limit: 80 },
    { id: 'W60', name: '女子 -60kg', limit: 60 },
    { id: 'SM80', name: 'シニア -80kg', limit: 80 },
  ],

  // 試合区分
  rounds: [
    { id: 'Q', name: '予選' },
    { id: 'W', name: '本戦' },
    { id: 'WF', name: '本戦決勝' },
    { id: 'L', name: '敗者復活戦' },
    { id: 'LF', name: '敗者復活戦決勝' },
    { id: 'F', name: '決勝' },
    { id: 'F2', name: '決勝2回戦目' },
  ],

  // 主催団体（大会の organizer に指定。どれにも当てはまらない場合は 'その他'）
  organizers: ['JAWA', 'AJAF', 'JAF', '日本腕相撲協会', 'その他'],

  formats: {
    double: 'トーナメント（敗者復活戦あり）',
    league: 'リーグ戦',
  },

  // 利き腕・階級・体重は大会の出場記録から自動で判定します
  athletes: [
    { id: 'a01', name: '佐藤 剛', nameEn: 'Tsuyoshi Sato', nickname: '鉄腕', team: 'TEAM IRON', photo: 'img/athletes/a01.svg', bio: 'トップロールを得意とするスピード型。両腕で上位を狙うオールラウンダー。' },
    { id: 'a02', name: '鈴木 拓海', nameEn: 'Takumi Suzuki', nickname: '湘南の鷹', team: '湘南アームクラブ', photo: 'img/athletes/a02.svg', bio: 'フックでの粘り強さに定評。長期戦に持ち込むと強い。' },
    { id: 'a03', name: '高橋 誠', nameEn: 'Makoto Takahashi', nickname: 'フックマスター', team: 'GRIP FACTORY', photo: 'img/athletes/a03.svg', bio: '右腕一本で勝負するベテラン。深いフックからの引き込みが武器。' },
    { id: 'a04', name: '田中 健太', nameEn: 'Kenta Tanaka', nickname: 'ケンタ', team: 'TEAM IRON', photo: 'img/athletes/a04.svg', bio: '左腕専門の若手。スタートの反応速度はクラス随一。' },
    { id: 'a05', name: '伊藤 翼', nameEn: 'Tsubasa Ito', nickname: 'ウィング', team: '浪速腕相撲道場', photo: 'img/athletes/a05.svg', bio: '手首の強さを活かしたトップロールで勝負する。' },
    { id: 'a06', name: '渡辺 大地', nameEn: 'Daichi Watanabe', nickname: '大地', team: 'KOBE ARMS', photo: 'img/athletes/a06.svg', bio: '軽量ながらパワーのあるファイター。左腕の伸びが著しい。' },
    { id: 'a07', name: '山本 光', nameEn: 'Hikaru Yamamoto', nickname: '閃光', team: '名古屋アームファイターズ', photo: 'img/athletes/a07.svg', bio: '一瞬で決めるスピード勝負が持ち味。右腕専門。' },
    { id: 'a08', name: '中村 蓮', nameEn: 'Ren Nakamura', nickname: 'サウスポー蓮', team: 'GRIP FACTORY', photo: 'img/athletes/a08.svg', bio: '左腕専門のテクニシャン。サイドプレッシャーで相手を崩す。' },
    { id: 'a09', name: '小林 悠真', nameEn: 'Yuma Kobayashi', nickname: 'ユーマ', team: '湘南アームクラブ', photo: 'img/athletes/a09.svg', bio: '競技を始めて間もない成長株。両腕で経験を積んでいる。' },
    { id: 'a10', name: '加藤 陸', nameEn: 'Riku Kato', nickname: '陸王', team: '博多アームズ', photo: 'img/athletes/a10.svg', bio: '-70kg級から増量し、秋季オープンで-80kg級に挑戦。' },
    { id: 'a11', name: '吉田 大輔', nameEn: 'Daisuke Yoshida', nickname: '浪速の怪物', team: '浪速腕相撲道場', photo: 'img/athletes/a11.svg', bio: '-80kg級の主役。圧倒的なサイドプレッシャー。' },
    { id: 'a12', name: '山田 翔', nameEn: 'Sho Yamada', nickname: 'ショー', team: 'KOBE ARMS', photo: 'img/athletes/a12.svg', bio: '右腕のパワーファイター。' },
    { id: 'a13', name: '佐々木 隆', nameEn: 'Takashi Sasaki', nickname: 'ザ・ウォール', team: '杜の都AWC', photo: 'img/athletes/a13.svg', bio: '守りの堅さから「壁」と呼ばれる。左腕がやや得意。' },
    { id: 'a14', name: '山口 亮', nameEn: 'Ryo Yamaguchi', nickname: 'リョウ', team: '名古屋アームファイターズ', photo: 'img/athletes/a14.svg', bio: '右腕専門。フックの深さが武器。' },
    { id: 'a15', name: '松本 拳', nameEn: 'Ken Matsumoto', nickname: '拳', team: 'TEAM IRON', photo: 'img/athletes/a15.svg', bio: '両腕とも安定した成績を残す実力者。' },
    { id: 'a16', name: '井上 勇気', nameEn: 'Yuki Inoue', nickname: 'ブレイブ', team: '博多アームズ', photo: 'img/athletes/a16.svg', bio: '気持ちの強さが持ち味の右腕ファイター。' },
    { id: 'a17', name: '木村 剛志', nameEn: 'Takeshi Kimura', nickname: 'ブル', team: 'GRIP FACTORY', photo: 'img/athletes/a17.svg', bio: '突進力のあるパワー型。' },
    { id: 'a18', name: '林 健一', nameEn: 'Kenichi Hayashi', nickname: 'ケンイチ', team: '杜の都AWC', photo: 'img/athletes/a18.svg', bio: '減量して-80kg級に参戦する技巧派。' },
    { id: 'a19', name: '清水 隼人', nameEn: 'Hayato Shimizu', nickname: 'ハヤブサ', team: 'KOBE ARMS', photo: 'img/athletes/a19.svg', bio: '左腕のエース。全日本では右腕にも出場。' },
    { id: 'a20', name: '山崎 豪', nameEn: 'Go Yamazaki', nickname: '豪腕', team: '浪速腕相撲道場', photo: 'img/athletes/a20.svg', bio: '名前の通りの豪腕。左腕が主戦場。' },
    { id: 'a21', name: '森 直樹', nameEn: 'Naoki Mori', nickname: 'ナオキ', team: '湘南アームクラブ', photo: 'img/athletes/a21.svg', bio: '左腕専門。粘り強い試合運び。' },
    { id: 'a22', name: '池田 武', nameEn: 'Takeru Ikeda', nickname: 'タケル', team: '博多アームズ', photo: 'img/athletes/a22.svg', bio: '左腕専門の若手。' },
    { id: 'a23', name: '橋本 美咲', nameEn: 'Misaki Hashimoto', nickname: 'ミサキ', team: 'TEAM IRON', photo: 'img/athletes/a23.svg', bio: '女子-60kg級のエース。両腕で優勝争いに絡む。' },
    { id: 'a24', name: '石川 由衣', nameEn: 'Yui Ishikawa', nickname: 'ユイ', team: 'GRIP FACTORY', photo: 'img/athletes/a24.svg', bio: 'テクニカルなフックが持ち味の右腕専門。' },
    { id: 'a25', name: '吉村 葵', nameEn: 'Aoi Yoshimura', nickname: 'アオイ', team: '博多アームズ', photo: 'img/athletes/a25.svg', bio: '左腕が得意な両腕選手。' },
    { id: 'a26', name: '前田 彩', nameEn: 'Aya Maeda', nickname: 'アヤ', team: '杜の都AWC', photo: 'img/athletes/a26.svg', bio: '右腕専門。今季急成長中。' },
    { id: 'a27', name: '藤田 さくら', nameEn: 'Sakura Fujita', nickname: 'さくら', team: '名古屋アームファイターズ', photo: 'img/athletes/a27.svg', bio: 'スピードのあるトップロールが武器。' },
    { id: 'a28', name: '岡田 莉子', nameEn: 'Riko Okada', nickname: 'レフティ莉子', team: 'KOBE ARMS', photo: 'img/athletes/a28.svg', bio: '左腕専門のサウスポー。' },
    { id: 'a29', name: '後藤 千尋', nameEn: 'Chihiro Goto', nickname: 'チヒロ', team: '湘南アームクラブ', photo: 'img/athletes/a29.svg', bio: '軽量級から参戦。全日本で右腕にも挑戦。' },
    { id: 'a30', name: '長谷川 萌', nameEn: 'Moe Hasegawa', nickname: 'モエ', team: '浪速腕相撲道場', photo: 'img/athletes/a30.svg', bio: '左腕専門。粘りのある試合運び。' },
    { id: 'a31', name: '西村 和也', nameEn: 'Kazuya Nishimura', nickname: '二刀流', team: 'KOBE ARMS', photo: 'img/athletes/a31.svg', bio: '-70kg級と-80kg級の右腕に同時エントリーする挑戦者。' },
    { id: 'a32', name: '原田 拓真', nameEn: 'Takuma Harada', nickname: '階級荒らし', team: '名古屋アームファイターズ', photo: 'img/athletes/a32.svg', bio: '左腕で-70kg級と-80kg級の両方に出場。上の階級でも臆さない。' },

    // ---- 本番データ ----
    { id: 'p01', name: '加藤 佳男', nameEn: 'KATOH YOSHO', nickname: ['マスクマン', 'カタン紳士'], team: 'U.A.G TOKYO', photo: 'img/athletes/p01.jpg', bio: '' },
    { id: 'p02', name: '青山 大輝', nameEn: 'AOYAMA TAIKI', nickname: '', team: 'Team Cobra', photo: 'img/athletes/p02.jpg', bio: '' },
    { id: 'p03', name: '渋谷 友和', nameEn: 'SIBUYA TOMOKAZU', nickname: '', team: '北腕会', photo: 'img/athletes/p03.jpg', bio: '' },
    { id: 'p04', name: '齋藤 輝', nameEn: 'SAITO HIKARU', nickname: '', team: '', photo: 'img/athletes/noimage.svg', bio: '' },
  ],

  tournaments: [
    // ---- 本番データ ----
    {
      id: 'jo32', organizer: 'JAF', name: '第32回ジャパンオープンアームレスリング選手権大会', short: '第32回ジャパンオープン', date: '2026-01-11',
      venue: '宮城県・エルパーク仙台 ギャラリーホール', level: '全国大会（アジア選手権 日本代表選考会）',
      weighIns: {},
      divisions: [
        {
          classId: 'SM80', arm: 'L', format: 'double', entries: ['p02', 'p01', 'p03', 'p04'],
          matches: [
            { id: 'jo32-SM80-L-W1-1', round: 'W', no: 1, slot: 1, a: 'p02', b: 'p01', winner: 'p01', method: 'ピン勝ち' },
            { id: 'jo32-SM80-L-W1-2', round: 'W', no: 1, slot: 2, a: 'p03', b: 'p04', winner: 'p03', method: 'ピン勝ち' },
            { id: 'jo32-SM80-L-WF', round: 'WF', no: 0, slot: 1, a: 'p01', b: 'p03', winner: 'p03', method: 'ピン勝ち' },
            { id: 'jo32-SM80-L-L1-1', round: 'L', no: 1, slot: 1, a: 'p02', b: 'p04', winner: 'p02', method: 'ピン勝ち' },
            { id: 'jo32-SM80-L-LF', round: 'LF', no: 0, slot: 1, a: 'p02', b: 'p01', winner: 'p01', method: 'ピン勝ち' },
            { id: 'jo32-SM80-L-F', round: 'F', no: 0, slot: 1, a: 'p03', b: 'p01', winner: 'p03', method: 'ピン勝ち' },
          ],
        },
        {
          // 川上選手は欠場（×）のため、該当の試合は不戦として除外
          classId: 'SM80', arm: 'R', format: 'double', entries: ['p04', 'p02', 'p03', 'p01'],
          matches: [
            { id: 'jo32-SM80-R-W1-1', round: 'W', no: 1, slot: 1, a: 'p04', b: 'p02', winner: 'p02', method: 'ピン勝ち' },
            { id: 'jo32-SM80-R-W1-2', round: 'W', no: 1, slot: 2, a: 'p03', b: 'p01', winner: 'p03', method: 'ピン勝ち' },
            { id: 'jo32-SM80-R-WF', round: 'WF', no: 0, slot: 1, a: 'p02', b: 'p03', winner: 'p03', method: 'ピン勝ち' },
            { id: 'jo32-SM80-R-L1-1', round: 'L', no: 1, slot: 1, a: 'p01', b: 'p04', winner: 'p01', method: 'ピン勝ち' },
            { id: 'jo32-SM80-R-LF', round: 'LF', no: 0, slot: 1, a: 'p01', b: 'p02', winner: 'p02', method: 'ピン勝ち' },
            { id: 'jo32-SM80-R-F', round: 'F', no: 0, slot: 1, a: 'p03', b: 'p02', winner: 'p03', method: 'ピン勝ち' },
          ],
        },
      ],
    },

    // ---- サンプルデータ（架空） ----
    {
      id: 't1', sample: true, organizer: 'JAWA', name: '2026 東日本アームレスリング選手権', short: '東日本選手権', date: '2026-04-19',
      venue: '東京都・墨田区総合体育館', level: '地方大会',
      weighIns: {
        a01: 69.2, a02: 68.5, a03: 69.7, a04: 67.1, a05: 68.9, a06: 66.4, a07: 69.5, a08: 68.0, a09: 67.6, a10: 69.8,
        a11: 79.6, a12: 78.2, a13: 79.1, a14: 76.8, a15: 78.9, a16: 77.4, a17: 79.8, a18: 75.9, a19: 78.4, a20: 79.3, a21: 77.0, a22: 76.2,
        a23: 59.4, a24: 58.7, a25: 59.8, a26: 57.2, a27: 58.1, a28: 59.0, a29: 56.4, a30: 58.8,
      },
      divisions: [
        { classId: 'M70', arm: 'R', format: 'double', entries: ['a01', 'a02', 'a03', 'a07', 'a05', 'a10', 'a06', 'a09'] },
        { classId: 'M70', arm: 'L', format: 'double', entries: ['a08', 'a01', 'a04', 'a02', 'a06', 'a05', 'a10', 'a09'] },
        { classId: 'M80', arm: 'R', format: 'double', entries: ['a11', 'a12', 'a13', 'a15', 'a14', 'a17', 'a16', 'a18'] },
        { classId: 'M80', arm: 'L', format: 'double', entries: ['a19', 'a11', 'a13', 'a20', 'a17', 'a15', 'a21', 'a22'] },
        { classId: 'W60', arm: 'R', format: 'league', final: true, entries: ['a23', 'a24', 'a27', 'a25', 'a26'] },
        { classId: 'W60', arm: 'L', format: 'league', final: true, entries: ['a25', 'a23', 'a28', 'a30', 'a29'] },
      ],
    },
    {
      id: 't2', sample: true, organizer: 'AJAF', name: '2026 全日本アームレスリング選手権', short: '全日本選手権', date: '2026-07-12',
      venue: '大阪府・エディオンアリーナ大阪', level: '全国大会',
      weighIns: {
        a01: 68.7, a02: 69.1, a03: 69.4, a04: 67.8, a05: 69.3, a06: 67.0, a07: 69.9, a08: 68.4, a09: 68.2,
        a11: 79.2, a12: 78.8, a13: 79.5, a14: 77.3, a15: 78.1, a16: 77.9, a17: 79.6, a18: 76.4, a19: 78.9, a20: 79.0, a21: 77.6, a22: 75.8,
        a23: 59.1, a24: 59.3, a25: 59.6, a26: 57.9, a27: 58.5, a28: 58.6, a29: 57.0, a30: 59.2,
        a31: 69.4, a32: 68.8,
      },
      divisions: [
        { classId: 'M70', arm: 'R', format: 'double', entries: ['a02', 'a01', 'a03', 'a07', 'a05', 'a06', 'a09', 'a31'] },
        { classId: 'M70', arm: 'L', format: 'double', entries: ['a01', 'a08', 'a04', 'a02', 'a06', 'a05', 'a09', 'a32'] },
        { classId: 'M80', arm: 'R', format: 'double', entries: ['a11', 'a12', 'a13', 'a15', 'a14', 'a17', 'a19', 'a16', 'a20', 'a18', 'a31'] },
        { classId: 'M80', arm: 'L', format: 'double', entries: ['a19', 'a11', 'a13', 'a20', 'a17', 'a15', 'a21', 'a22', 'a32'] },
        { classId: 'W60', arm: 'R', format: 'league', final: true, entries: ['a24', 'a23', 'a27', 'a25', 'a26', 'a29'] },
        { classId: 'W60', arm: 'L', format: 'league', final: true, entries: ['a25', 'a23', 'a28', 'a29', 'a30'] },
      ],
    },
    {
      id: 't3', sample: true, organizer: '日本腕相撲協会', name: '2026 秋季アームレスリングオープン', short: '秋季オープン', date: '2026-09-27',
      venue: '愛知県・名古屋市総合体育館', level: 'オープン大会',
      weighIns: {
        a01: 69.5, a02: 68.9, a03: 69.8, a04: 68.3, a05: 68.6, a06: 67.4, a07: 69.6, a08: 68.9, a09: 68.8,
        a10: 73.6, a11: 79.4, a12: 78.5, a13: 79.0, a14: 77.8, a15: 78.6, a17: 79.9, a18: 76.7, a19: 79.1, a20: 79.4, a21: 78.0,
        a23: 59.6, a24: 58.9, a25: 59.9, a26: 58.3, a27: 58.0, a28: 59.3, a29: 57.5, a30: 59.0,
        a31: 69.7, a32: 69.2,
      },
      divisions: [
        { classId: 'M70', arm: 'R', format: 'double', entries: ['a01', 'a02', 'a07', 'a03', 'a05', 'a06', 'a09', 'a31'] },
        { classId: 'M70', arm: 'L', format: 'double', entries: ['a08', 'a01', 'a04', 'a06', 'a02', 'a05', 'a09', 'a32'] },
        { classId: 'M80', arm: 'R', format: 'double', entries: ['a11', 'a13', 'a12', 'a15', 'a14', 'a17', 'a10', 'a18', 'a31'] },
        { classId: 'M80', arm: 'L', format: 'double', entries: ['a19', 'a11', 'a13', 'a20', 'a15', 'a17', 'a21', 'a10', 'a32'] },
        { classId: 'W60', arm: 'R', format: 'league', final: true, entries: ['a23', 'a24', 'a27', 'a26', 'a25'] },
        { classId: 'W60', arm: 'L', format: 'league', final: true, entries: ['a25', 'a23', 'a28', 'a29', 'a30'] },
      ],
    },
  ],

  videos: {
    // 第32回ジャパンオープン シニア -80kg（start〜end 秒の範囲だけ再生）
    // 左腕
    'jo32-SM80-L-W1-1': { url: 'https://youtu.be/erxZ_ZOBl-U', start: 5528, end: 5623 }, // 1:32:08〜1:33:43
    'jo32-SM80-L-W1-2': { url: 'https://youtu.be/erxZ_ZOBl-U', start: 5640, end: 5747 }, // 1:34:00〜1:35:47
    'jo32-SM80-L-WF': { url: 'https://youtu.be/erxZ_ZOBl-U', start: 5760, end: 5864 }, // 1:36:00〜1:37:44
    'jo32-SM80-L-L1-1': { url: 'https://youtu.be/36AsXpQAT8Y', start: 665, end: 768 }, // 0:11:05〜0:12:48
    'jo32-SM80-L-LF': { url: 'https://youtu.be/36AsXpQAT8Y', start: 780, end: 865 }, // 0:13:00〜0:14:25
    'jo32-SM80-L-F': { url: 'https://youtu.be/_tn-xLkqvlE', start: 3090, end: 3160 }, // 0:51:30〜0:52:40
    // 右腕
    'jo32-SM80-R-W1-1': { url: 'https://youtu.be/erxZ_ZOBl-U', start: 5956, end: 6060 }, // 1:39:16〜1:41:00
    'jo32-SM80-R-W1-2': { url: 'https://youtu.be/erxZ_ZOBl-U', start: 6080, end: 6206 }, // 1:41:20〜1:43:26
    'jo32-SM80-R-WF': { url: 'https://youtu.be/erxZ_ZOBl-U', start: 6290, end: 6451 }, // 1:44:50〜1:47:31
    'jo32-SM80-R-L1-1': { url: 'https://youtu.be/36AsXpQAT8Y', start: 345, end: 431 }, // 0:05:45〜0:07:11
    'jo32-SM80-R-LF': { url: 'https://youtu.be/36AsXpQAT8Y', start: 508, end: 616 }, // 0:08:28〜0:10:16
    'jo32-SM80-R-F': { url: 'https://youtu.be/_tn-xLkqvlE', start: 3175, end: 3296 }, // 0:52:55〜0:54:56
  },
};
