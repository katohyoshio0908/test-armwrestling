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
    { id: 'MM70', name: 'マスターズ男子 -70kg', limit: 70 },
    { id: 'MM80', name: 'マスターズ男子 -80kg', limit: 80 },
    { id: 'MM90', name: 'マスターズ男子 -90kg', limit: 90 },
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

  // 国籍（選手の nationality に id を指定）
  countries: [
    { id: 'JPN', name: '日本' },
    { id: 'NEU', name: 'WAF中立選手' },
    { id: 'AUS', name: 'オーストラリア' },
    { id: 'BGR', name: 'ブルガリア' },
    { id: 'BRA', name: 'ブラジル' },
    { id: 'CAN', name: 'カナダ' },
    { id: 'CHE', name: 'スイス' },
    { id: 'CZE', name: 'チェコ' },
    { id: 'DEU', name: 'ドイツ' },
    { id: 'ESP', name: 'スペイン' },
    { id: 'FRA', name: 'フランス' },
    { id: 'GEO', name: 'ジョージア' },
    { id: 'HUN', name: 'ハンガリー' },
    { id: 'IND', name: 'インド' },
    { id: 'ITA', name: 'イタリア' },
    { id: 'KAZ', name: 'カザフスタン' },
    { id: 'LVA', name: 'ラトビア' },
    { id: 'MDA', name: 'モルドバ' },
    { id: 'MEX', name: 'メキシコ' },
    { id: 'MNG', name: 'モンゴル' },
    { id: 'NOR', name: 'ノルウェー' },
    { id: 'ROU', name: 'ルーマニア' },
    { id: 'SVK', name: 'スロバキア' },
    { id: 'TUR', name: 'トルコ' },
    { id: 'UKR', name: 'ウクライナ' },
    { id: 'USA', name: 'アメリカ' },
    { id: 'UZB', name: 'ウズベキスタン' },
  ],

  // 主催団体（大会の organizer に指定。どれにも当てはまらない場合は 'その他'）
  organizers: ['JAWA', 'AJAF', 'JAF', '日本腕相撲協会', 'その他'],

  formats: {
    double: 'トーナメント（敗者復活戦あり）',
    league: 'リーグ戦',
  },

  // 利き腕・階級・体重は大会の出場記録から自動で判定します
  athletes: [
    { id: 'a01', name: '佐藤 剛', nameEn: 'Tsuyoshi Sato', nationality: 'JPN', nickname: '鉄腕', team: 'TEAM IRON', photo: 'img/athletes/a01.svg', bio: 'トップロールを得意とするスピード型。両腕で上位を狙うオールラウンダー。' },
    { id: 'a02', name: '鈴木 拓海', nameEn: 'Takumi Suzuki', nationality: 'JPN', nickname: '湘南の鷹', team: '湘南アームクラブ', photo: 'img/athletes/a02.svg', bio: 'フックでの粘り強さに定評。長期戦に持ち込むと強い。' },
    { id: 'a03', name: '高橋 誠', nameEn: 'Makoto Takahashi', nationality: 'JPN', nickname: 'フックマスター', team: 'GRIP FACTORY', photo: 'img/athletes/a03.svg', bio: '右腕一本で勝負するベテラン。深いフックからの引き込みが武器。' },
    { id: 'a04', name: '田中 健太', nameEn: 'Kenta Tanaka', nationality: 'JPN', nickname: 'ケンタ', team: 'TEAM IRON', photo: 'img/athletes/a04.svg', bio: '左腕専門の若手。スタートの反応速度はクラス随一。' },
    { id: 'a05', name: '伊藤 翼', nameEn: 'Tsubasa Ito', nationality: 'JPN', nickname: 'ウィング', team: '浪速腕相撲道場', photo: 'img/athletes/a05.svg', bio: '手首の強さを活かしたトップロールで勝負する。' },
    { id: 'a06', name: '渡辺 大地', nameEn: 'Daichi Watanabe', nationality: 'JPN', nickname: '大地', team: 'KOBE ARMS', photo: 'img/athletes/a06.svg', bio: '軽量ながらパワーのあるファイター。左腕の伸びが著しい。' },
    { id: 'a07', name: '山本 光', nameEn: 'Hikaru Yamamoto', nationality: 'JPN', nickname: '閃光', team: '名古屋アームファイターズ', photo: 'img/athletes/a07.svg', bio: '一瞬で決めるスピード勝負が持ち味。右腕専門。' },
    { id: 'a08', name: '中村 蓮', nameEn: 'Ren Nakamura', nationality: 'JPN', nickname: 'サウスポー蓮', team: 'GRIP FACTORY', photo: 'img/athletes/a08.svg', bio: '左腕専門のテクニシャン。サイドプレッシャーで相手を崩す。' },
    { id: 'a09', name: '小林 悠真', nameEn: 'Yuma Kobayashi', nationality: 'JPN', nickname: 'ユーマ', team: '湘南アームクラブ', photo: 'img/athletes/a09.svg', bio: '競技を始めて間もない成長株。両腕で経験を積んでいる。' },
    { id: 'a10', name: '加藤 陸', nameEn: 'Riku Kato', nationality: 'JPN', nickname: '陸王', team: '博多アームズ', photo: 'img/athletes/a10.svg', bio: '-70kg級から増量し、秋季オープンで-80kg級に挑戦。' },
    { id: 'a11', name: '吉田 大輔', nameEn: 'Daisuke Yoshida', nationality: 'JPN', nickname: '浪速の怪物', team: '浪速腕相撲道場', photo: 'img/athletes/a11.svg', bio: '-80kg級の主役。圧倒的なサイドプレッシャー。' },
    { id: 'a12', name: '山田 翔', nameEn: 'Sho Yamada', nationality: 'JPN', nickname: 'ショー', team: 'KOBE ARMS', photo: 'img/athletes/a12.svg', bio: '右腕のパワーファイター。' },
    { id: 'a13', name: '佐々木 隆', nameEn: 'Takashi Sasaki', nationality: 'JPN', nickname: 'ザ・ウォール', team: '杜の都AWC', photo: 'img/athletes/a13.svg', bio: '守りの堅さから「壁」と呼ばれる。左腕がやや得意。' },
    { id: 'a14', name: '山口 亮', nameEn: 'Ryo Yamaguchi', nationality: 'JPN', nickname: 'リョウ', team: '名古屋アームファイターズ', photo: 'img/athletes/a14.svg', bio: '右腕専門。フックの深さが武器。' },
    { id: 'a15', name: '松本 拳', nameEn: 'Ken Matsumoto', nationality: 'JPN', nickname: '拳', team: 'TEAM IRON', photo: 'img/athletes/a15.svg', bio: '両腕とも安定した成績を残す実力者。' },
    { id: 'a16', name: '井上 勇気', nameEn: 'Yuki Inoue', nationality: 'JPN', nickname: 'ブレイブ', team: '博多アームズ', photo: 'img/athletes/a16.svg', bio: '気持ちの強さが持ち味の右腕ファイター。' },
    { id: 'a17', name: '木村 剛志', nameEn: 'Takeshi Kimura', nationality: 'JPN', nickname: 'ブル', team: 'GRIP FACTORY', photo: 'img/athletes/a17.svg', bio: '突進力のあるパワー型。' },
    { id: 'a18', name: '林 健一', nameEn: 'Kenichi Hayashi', nationality: 'JPN', nickname: 'ケンイチ', team: '杜の都AWC', photo: 'img/athletes/a18.svg', bio: '減量して-80kg級に参戦する技巧派。' },
    { id: 'a19', name: '清水 隼人', nameEn: 'Hayato Shimizu', nationality: 'JPN', nickname: 'ハヤブサ', team: 'KOBE ARMS', photo: 'img/athletes/a19.svg', bio: '左腕のエース。全日本では右腕にも出場。' },
    { id: 'a20', name: '山崎 豪', nameEn: 'Go Yamazaki', nationality: 'JPN', nickname: '豪腕', team: '浪速腕相撲道場', photo: 'img/athletes/a20.svg', bio: '名前の通りの豪腕。左腕が主戦場。' },
    { id: 'a21', name: '森 直樹', nameEn: 'Naoki Mori', nationality: 'JPN', nickname: 'ナオキ', team: '湘南アームクラブ', photo: 'img/athletes/a21.svg', bio: '左腕専門。粘り強い試合運び。' },
    { id: 'a22', name: '池田 武', nameEn: 'Takeru Ikeda', nationality: 'JPN', nickname: 'タケル', team: '博多アームズ', photo: 'img/athletes/a22.svg', bio: '左腕専門の若手。' },
    { id: 'a23', name: '橋本 美咲', nameEn: 'Misaki Hashimoto', nationality: 'JPN', nickname: 'ミサキ', team: 'TEAM IRON', photo: 'img/athletes/a23.svg', bio: '女子-60kg級のエース。両腕で優勝争いに絡む。' },
    { id: 'a24', name: '石川 由衣', nameEn: 'Yui Ishikawa', nationality: 'JPN', nickname: 'ユイ', team: 'GRIP FACTORY', photo: 'img/athletes/a24.svg', bio: 'テクニカルなフックが持ち味の右腕専門。' },
    { id: 'a25', name: '吉村 葵', nameEn: 'Aoi Yoshimura', nationality: 'JPN', nickname: 'アオイ', team: '博多アームズ', photo: 'img/athletes/a25.svg', bio: '左腕が得意な両腕選手。' },
    { id: 'a26', name: '前田 彩', nameEn: 'Aya Maeda', nationality: 'JPN', nickname: 'アヤ', team: '杜の都AWC', photo: 'img/athletes/a26.svg', bio: '右腕専門。今季急成長中。' },
    { id: 'a27', name: '藤田 さくら', nameEn: 'Sakura Fujita', nationality: 'JPN', nickname: 'さくら', team: '名古屋アームファイターズ', photo: 'img/athletes/a27.svg', bio: 'スピードのあるトップロールが武器。' },
    { id: 'a28', name: '岡田 莉子', nameEn: 'Riko Okada', nationality: 'JPN', nickname: 'レフティ莉子', team: 'KOBE ARMS', photo: 'img/athletes/a28.svg', bio: '左腕専門のサウスポー。' },
    { id: 'a29', name: '後藤 千尋', nameEn: 'Chihiro Goto', nationality: 'JPN', nickname: 'チヒロ', team: '湘南アームクラブ', photo: 'img/athletes/a29.svg', bio: '軽量級から参戦。全日本で右腕にも挑戦。' },
    { id: 'a30', name: '長谷川 萌', nameEn: 'Moe Hasegawa', nationality: 'JPN', nickname: 'モエ', team: '浪速腕相撲道場', photo: 'img/athletes/a30.svg', bio: '左腕専門。粘りのある試合運び。' },
    { id: 'a31', name: '西村 和也', nameEn: 'Kazuya Nishimura', nationality: 'JPN', nickname: '二刀流', team: 'KOBE ARMS', photo: 'img/athletes/a31.svg', bio: '-70kg級と-80kg級の右腕に同時エントリーする挑戦者。' },
    { id: 'a32', name: '原田 拓真', nameEn: 'Takuma Harada', nationality: 'JPN', nickname: '階級荒らし', team: '名古屋アームファイターズ', photo: 'img/athletes/a32.svg', bio: '左腕で-70kg級と-80kg級の両方に出場。上の階級でも臆さない。' },

    // ---- 本番データ ----
    { id: 'p01', name: '加藤 佳男', nameEn: 'KATOH YOSHIO', nationality: 'JPN', nickname: ['マスクマン', 'カタン紳士'], team: 'U.A.G TOKYO', photo: 'img/athletes/p01.jpg', bio: '' },
    { id: 'p02', name: '青山 大輝', nameEn: 'AOYAMA TAIKI', nationality: 'JPN', nickname: '', team: 'Team Cobra', photo: 'img/athletes/p02.jpg', bio: '' },
    { id: 'p03', name: '渋谷 友和', nameEn: 'SIBUYA TOMOKAZU', nationality: 'JPN', nickname: '', team: '北腕会', photo: 'img/athletes/p03.jpg', bio: '' },
    { id: 'p04', name: '齋藤 輝', nameEn: 'SAITO HIKARU', nationality: 'JPN', nickname: '', team: '', photo: 'img/athletes/noimage.svg', bio: '' },

    // ---- 本番データ：2025 WAF世界選手権 出場選手（渋谷 p03・加藤 p01 は上記） ----
    { id: 'w01', name: 'アレクサンドル シャプキン', nameEn: 'Aleksander Shapkin', nationality: 'NEU', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w02', name: 'ステファン エルー', nameEn: 'Stephane Heroux', nationality: 'CAN', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w03', name: 'イェヴヘン ヴァクラ', nameEn: 'Yevhen Vakula', nationality: 'UKR', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w04', name: 'アルチョム ボンダレフ', nameEn: 'Artiom Bondarev', nationality: 'MDA', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w05', name: 'ベルトラン トラヴァリーニ', nameEn: 'Bertrand Travaglini', nationality: 'FRA', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w06', name: 'フラヴィウ ゴイア', nameEn: 'Flaviu Goia', nationality: 'ROU', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w07', name: 'メヴリュト トゥルグト', nameEn: 'Mevlut Turgut', nationality: 'TUR', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w08', name: 'キリル ボグダンスキ', nameEn: 'Kiril Bogdanski', nationality: 'BGR', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w09', name: 'ミハイル ソロニン', nameEn: 'Mikhail Solonin', nationality: 'KAZ', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w10', name: 'オスマン コプズ', nameEn: 'Osman Kopuz', nationality: 'TUR', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w11', name: 'マムカ リパルタシュヴィリ', nameEn: 'Mamuka Lipartashvili', nationality: 'GEO', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w12', name: 'アフメト セキン', nameEn: 'Ahmet Sekin', nationality: 'DEU', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w13', name: 'チトレシュワル ロウレンバム', nameEn: 'Chitreshwar Lourembam', nationality: 'IND', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w14', name: 'ロバート ベリー', nameEn: 'Robert Belley', nationality: 'USA', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w15', name: 'ノダル ギウナシュヴィリ', nameEn: 'Nodar Giunashvili', nationality: 'GEO', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w16', name: 'ロレンソ ビリャール', nameEn: 'Lorenzo Villar', nationality: 'ESP', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w17', name: 'アレクス プレツアシュヴィリ', nameEn: 'Aleks Pretsuashvili', nationality: 'GEO', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w18', name: 'ヤーノシュ ドブロチ', nameEn: 'Janos Dobrocsi', nationality: 'HUN', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w19', name: 'アレクサンドル ウォシュール', nameEn: 'Alexandre Waucheul', nationality: 'FRA', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w20', name: 'ジャバ ゲティアシュヴィリ', nameEn: 'Jaba Getiashvili', nationality: 'GEO', team: '', photo: 'img/athletes/w20.jpg' },
    { id: 'w21', name: 'アンドレアス ヘフナー', nameEn: 'Andreas Hoeffner', nationality: 'DEU', team: '', photo: 'img/athletes/w21.jpg' },
    { id: 'w22', name: 'ダニエル アンドロナケ', nameEn: 'Daniel Andronache', nationality: 'ROU', team: '', photo: 'img/athletes/w22.jpg' },
    { id: 'w23', name: 'ドミトリー ドクチャエフ', nameEn: 'Dmitriy Dokuchaev', nationality: 'UZB', team: '', photo: 'img/athletes/w23.jpg' },
    { id: 'w24', name: 'ヤロミール ベルネク', nameEn: 'Jaromir Belunek', nationality: 'CZE', team: '', photo: 'img/athletes/w24.jpg' },
    { id: 'w25', name: 'オスバルド アラニス', nameEn: 'Osvaldo Alanis', nationality: 'MEX', team: '', photo: 'img/athletes/w25.jpg' },
    { id: 'w26', name: 'プラチド ジョーコ', nameEn: 'Placido Gioco', nationality: 'ITA', team: '', photo: 'img/athletes/w26.jpg' },
    { id: 'w27', name: 'ペトル ヴェヴォダ', nameEn: 'Petr Vevoda', nationality: 'CZE', team: '', photo: 'img/athletes/w27.jpg' },
    { id: 'w28', name: 'ディミタル ユレフ', nameEn: 'Dimitar Yulev', nationality: 'BGR', team: '', photo: 'img/athletes/w28.jpg' },
    { id: 'w29', name: '大高 宏英', nameEn: 'Hirohide Otaka', nationality: 'JPN', team: '誠腕道場', photo: 'img/athletes/w29.jpg' },
    { id: 'w30', name: 'ハラルド シグモンド', nameEn: 'Harald Sigmond', nationality: 'NOR', team: '', photo: 'img/athletes/w30.jpg' },
    { id: 'w31', name: 'アルノー ブリヤン', nameEn: 'Arnaud Brillant', nationality: 'FRA', team: '', photo: 'img/athletes/w31.jpg' },
    { id: 'w32', name: 'レネ ショルツェ', nameEn: 'Rene Scholze', nationality: 'DEU', team: '', photo: 'img/athletes/w32.jpg' },
    { id: 'w33', name: 'ジェム アクタン', nameEn: 'Cem Aktan', nationality: 'TUR', team: '', photo: 'img/athletes/w33.jpg' },
    { id: 'w34', name: 'ピエトロ スキラッチ', nameEn: 'Pietro Schillaci', nationality: 'ITA', team: '', photo: 'img/athletes/w34.jpg' },
    { id: 'w35', name: 'アレクサンドル サラジャヌ', nameEn: 'Alexandru Salajanu', nationality: 'ROU', team: '', photo: 'img/athletes/w35.jpg' },
    { id: 'w36', name: 'ガントルガ デシグスレン', nameEn: 'Gantulga Deshigsuren', nationality: 'MNG', team: '', photo: 'img/athletes/w36.jpg' },
    { id: 'w37', name: 'マウリシオ メンデス', nameEn: 'Mauricio Mendes', nationality: 'BRA', team: '', photo: 'img/athletes/w37.jpg' },
    { id: 'w38', name: 'レナート トロクスラー', nameEn: 'Troxler Renato', nationality: 'CHE', team: '', photo: 'img/athletes/w38.jpg' },
    { id: 'w39', name: 'エンフタイヴァン ハドガー', nameEn: 'Enkhtaivan Khadgaa', nationality: 'MNG', team: '', photo: 'img/athletes/w39.jpg' },
    { id: 'w40', name: 'マトゥシュ フルビク', nameEn: 'Matus Hlubik', nationality: 'SVK', team: '', photo: 'img/athletes/w40.jpg' },
    { id: 'w41', name: 'ジョージ ドブリン', nameEn: 'George Dobrin', nationality: 'ROU', team: '', photo: 'img/athletes/w41.jpg' },
    { id: 'w42', name: 'ヴァズゲン ソゴヤン', nameEn: 'Vazgen Soghoyan', nationality: 'USA', team: '', photo: 'img/athletes/w42.jpg' },
    { id: 'w43', name: 'イブラギム ティムルジエフ', nameEn: 'Ibragim Timurziev', nationality: 'NEU', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w44', name: 'シャミル トコフ', nameEn: 'Shamil Tokov', nationality: 'NEU', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w45', name: 'ホー リー', nameEn: 'Ho- Ri-', nationality: 'JPN', team: 'OSSU!!', photo: 'img/athletes/noimage.svg' },
    { id: 'w46', name: 'マリアン オルザニカ', nameEn: 'Marian Orzanica', nationality: 'ROU', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w47', name: 'アイガルス ルズギス', nameEn: 'Aigars Ruzgis', nationality: 'LVA', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w48', name: 'コスミン ロマネスク', nameEn: 'Cosmin Romanescu', nationality: 'ROU', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w49', name: 'フィル ラスムセン', nameEn: 'Phil Rasmussen', nationality: 'AUS', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w50', name: 'ミロスラフ トドロフ', nameEn: 'Miroslav Todorov', nationality: 'BGR', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w51', name: 'ジュリアン ポワベルオー', nameEn: 'Julien Poisbelaud', nationality: 'FRA', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w52', name: 'アルベルト ムヌエラ', nameEn: 'Alberto Munuera', nationality: 'ESP', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w53', name: 'イェナル クルチ', nameEn: 'Yenal Kilic', nationality: 'TUR', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w54', name: 'イジー ポフネク', nameEn: 'Jiri Pohunek', nationality: 'CZE', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w55', name: 'ミカエル ショーディン', nameEn: 'Mikael Sjodin', nationality: 'NOR', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w56', name: 'ヤン ニーモ', nameEn: 'Jan Nymo', nationality: 'NOR', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w57', name: 'ダヴィト イヴァニゼ', nameEn: 'Davit Ivanidze', nationality: 'GEO', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w58', name: '飯野 和哉', nameEn: 'Iino Kazuki', nationality: 'JPN', team: '中野アームスピリッツ', photo: 'img/athletes/noimage.svg' },
    { id: 'w59', name: 'アンドリアン ゲツ', nameEn: 'Andrian Ghetu', nationality: 'MDA', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w60', name: 'プリンス ディール', nameEn: 'Prince Dhir', nationality: 'IND', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w61', name: '植松 政憲', nameEn: 'Uematsu Masanori', nationality: 'JPN', team: 'SAFARI', photo: 'img/athletes/noimage.svg' },
    { id: 'w62', name: 'ビジナ マリアシュヴィリ', nameEn: 'Bidzina Mariashvili', nationality: 'GEO', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w63', name: 'ルイス バレラ', nameEn: 'Louis Barrera', nationality: 'USA', team: '', photo: 'img/athletes/noimage.svg' },
  ],

  tournaments: [
    // ---- 本番データ ----
    {
      // 出場選手のみ登録（試合結果・順位は未入力のため matches は空）
      id: 'waf2025', organizer: 'その他', name: '2025 WAFアームレスリング 世界選手権', short: '2025 WAF世界選手権',
      date: '2025-09-10', endDate: '2025-09-23', venue: 'ブルガリア・アルベナ', level: '世界大会',
      weighIns: {},
      divisions: [
        { classId: 'MM70', arm: 'L', format: 'double', matches: [], entries: ['w01', 'w02', 'w03', 'w04', 'w05', 'w06', 'w07', 'w08', 'w09', 'w10', 'p03', 'w11', 'w12', 'w13', 'w14', 'w15'] },
        { classId: 'MM70', arm: 'R', format: 'double', matches: [], entries: ['w16', 'w01', 'w17', 'w03', 'w06', 'p03', 'w18', 'w02', 'w04', 'w14', 'w05', 'w19', 'w10', 'w07', 'w12', 'w09', 'w11', 'w13'] },
        {
          // 出典: WAF2025_80kg_left_interim_analysis.xlsx（動画前半の中間集計。決勝は未登録）
          // Nodar Giunashvili の不戦勝2件（本戦1回戦・敗者復活1回戦）は出場者外のため不戦として除外
          classId: 'MM80', arm: 'L', format: 'double',
          entries: ['w20', 'w21', 'w22', 'w23', 'w24', 'w25', 'w26', 'w27', 'w28', 'w29', 'w30', 'w31', 'w32', 'w33', 'p01', 'w34', 'w35', 'w36', 'w37', 'w38', 'w39'],
          matches: [
            // 本戦1回戦
            { id: 'waf2025-MM80-L-W1-1', round: 'W', no: 1, slot: 1, a: 'w28', b: 'w21', winner: 'w21', method: '2ファール勝ち' },
            { id: 'waf2025-MM80-L-W1-2', round: 'W', no: 1, slot: 2, a: 'w29', b: 'w39', winner: 'w29', method: 'ピン勝ち' },
            { id: 'waf2025-MM80-L-W1-3', round: 'W', no: 1, slot: 3, a: 'w33', b: 'w22', winner: 'w22', method: 'ピン勝ち', note: 'レフリーズグリップ' },
            { id: 'waf2025-MM80-L-W1-4', round: 'W', no: 1, slot: 4, a: 'w38', b: 'w30', winner: 'w30', method: 'ピン勝ち', note: 'レフリーズグリップ' },
            { id: 'waf2025-MM80-L-W1-5', round: 'W', no: 1, slot: 5, a: 'w34', b: 'w32', winner: 'w34', method: 'ピン勝ち' },
            { id: 'waf2025-MM80-L-W1-6', round: 'W', no: 1, slot: 6, a: 'w23', b: 'w37', winner: 'w23', method: 'ピン勝ち' },
            { id: 'waf2025-MM80-L-W1-7', round: 'W', no: 1, slot: 7, a: 'w20', b: 'w27', winner: 'w20', method: 'ピン勝ち', note: 'レフリーズグリップ' },
            { id: 'waf2025-MM80-L-W1-8', round: 'W', no: 1, slot: 8, a: 'p01', b: 'w36', winner: 'p01', method: 'ピン勝ち' },
            { id: 'waf2025-MM80-L-W1-9', round: 'W', no: 1, slot: 9, a: 'w31', b: 'w24', winner: 'w24', method: 'ウィナーズポジション', note: '勝ち方は要確認（Excelの記載のまま）' },
            // 本戦2回戦
            { id: 'waf2025-MM80-L-W2-1', round: 'W', no: 2, slot: 1, a: 'w25', b: 'w26', winner: 'w26', method: 'ピン勝ち' },
            { id: 'waf2025-MM80-L-W2-2', round: 'W', no: 2, slot: 2, a: 'w35', b: 'w21', winner: 'w21', method: 'ピン勝ち' },
            { id: 'waf2025-MM80-L-W2-3', round: 'W', no: 2, slot: 3, a: 'w29', b: 'w22', winner: 'w22', method: 'ピン勝ち', note: 'ストラップ' },
            { id: 'waf2025-MM80-L-W2-4', round: 'W', no: 2, slot: 4, a: 'w30', b: 'w34', winner: 'w30', method: 'ピン勝ち' },
            { id: 'waf2025-MM80-L-W2-5', round: 'W', no: 2, slot: 5, a: 'w23', b: 'w20', winner: 'w20', method: 'ピン勝ち', note: 'レフリーズグリップ、ストラップ／勝者はExcelで空欄のため、その後の勝ち上がりから推定' },
            { id: 'waf2025-MM80-L-W2-6', round: 'W', no: 2, slot: 6, a: 'p01', b: 'w24', winner: 'w24', method: 'ピン勝ち', note: 'レフリーズグリップ、ストラップ' },
            // 本戦3回戦
            { id: 'waf2025-MM80-L-W3-1', round: 'W', no: 3, slot: 1, a: 'w26', b: 'w21', winner: 'w21', method: 'ピン勝ち', note: 'レフリーズグリップ' },
            { id: 'waf2025-MM80-L-W3-2', round: 'W', no: 3, slot: 2, a: 'w22', b: 'w30', winner: 'w22', method: 'ピン勝ち' },
            { id: 'waf2025-MM80-L-W3-3', round: 'W', no: 3, slot: 3, a: 'w20', b: 'w24', winner: 'w20', method: '2ファール勝ち', note: 'レフリーズグリップ、ストラップ' },
            // 本戦4回戦
            { id: 'waf2025-MM80-L-W4-1', round: 'W', no: 4, slot: 1, a: 'w21', b: 'w22', winner: 'w21', method: '2ファール勝ち', note: 'ストラップ' },
            // 本戦決勝
            { id: 'waf2025-MM80-L-WF', round: 'WF', no: 0, slot: 1, a: 'w20', b: 'w21', winner: 'w21', method: '2ファール勝ち' },
            // 敗者復活戦1回戦
            { id: 'waf2025-MM80-L-L1-1', round: 'L', no: 1, slot: 1, a: 'w39', b: 'w33', winner: 'w33', method: 'ピン勝ち' },
            { id: 'waf2025-MM80-L-L1-2', round: 'L', no: 1, slot: 2, a: 'w38', b: 'w32', winner: 'w32', method: '2ファール勝ち' },
            { id: 'waf2025-MM80-L-L1-3', round: 'L', no: 1, slot: 3, a: 'w37', b: 'w27', winner: 'w27', method: '2ファール勝ち', note: 'レフリーズグリップ、ストラップ' },
            { id: 'waf2025-MM80-L-L1-4', round: 'L', no: 1, slot: 4, a: 'w36', b: 'w31', winner: 'w31', method: 'ピン勝ち' },
            // 敗者復活戦2回戦
            { id: 'waf2025-MM80-L-L2-1', round: 'L', no: 2, slot: 1, a: 'w25', b: 'w35', winner: 'w25', method: '2ファール勝ち', note: 'レフリーズグリップ' },
            { id: 'waf2025-MM80-L-L2-2', round: 'L', no: 2, slot: 2, a: 'w29', b: 'w34', winner: 'w29', method: 'ピン勝ち', note: 'レフリーズグリップ' },
            { id: 'waf2025-MM80-L-L2-3', round: 'L', no: 2, slot: 3, a: 'w23', b: 'p01', winner: 'w23', method: 'ピン勝ち', note: 'レフリーズグリップ' },
            { id: 'waf2025-MM80-L-L2-4', round: 'L', no: 2, slot: 4, a: 'w28', b: 'w33', winner: 'w28', method: 'ピン勝ち', note: 'ストラップ' },
            { id: 'waf2025-MM80-L-L2-5', round: 'L', no: 2, slot: 5, a: 'w32', b: 'w27', winner: 'w27', method: 'ピン勝ち', note: 'ストラップ' },
            // 敗者復活戦3回戦
            { id: 'waf2025-MM80-L-L3-1', round: 'L', no: 3, slot: 1, a: 'w31', b: 'w26', winner: 'w26', method: 'ピン勝ち', note: 'レフリーズグリップ' },
            { id: 'waf2025-MM80-L-L3-2', round: 'L', no: 3, slot: 2, a: 'w30', b: 'w24', winner: 'w24', method: '2ファール勝ち', note: 'レフリーズグリップ、ストラップ' },
            { id: 'waf2025-MM80-L-L3-3', round: 'L', no: 3, slot: 3, a: 'w25', b: 'w29', winner: 'w25', method: 'ピン勝ち', note: 'レフリーズグリップ' },
            { id: 'waf2025-MM80-L-L3-4', round: 'L', no: 3, slot: 4, a: 'w23', b: 'w28', winner: 'w23', method: 'ピン勝ち', note: 'レフリーズグリップ、ストラップ' },
            { id: 'waf2025-MM80-L-L3-5', round: 'L', no: 3, slot: 5, a: 'w27', b: 'w22', winner: 'w22', method: 'ピン勝ち', note: 'ストラップ' },
            // 敗者復活戦4回戦
            { id: 'waf2025-MM80-L-L4-1', round: 'L', no: 4, slot: 1, a: 'w26', b: 'w24', winner: 'w24', method: 'ピン勝ち', note: 'レフリーズグリップ、ストラップ' },
            { id: 'waf2025-MM80-L-L4-2', round: 'L', no: 4, slot: 2, a: 'w25', b: 'w23', winner: 'w23', method: 'ピン勝ち' },
            // 敗者復活戦5回戦（Excelでは「4回戦目」表記。Belunekが同じ回戦で2試合になるため次の回戦として登録）
            { id: 'waf2025-MM80-L-L5-1', round: 'L', no: 5, slot: 1, a: 'w22', b: 'w24', winner: 'w22', method: 'ピン勝ち', note: 'ストラップ' },
            // 敗者復活戦準決勝
            { id: 'waf2025-MM80-L-L6-1', round: 'L', no: 6, slot: 1, label: '敗者復活戦準決勝', a: 'w23', b: 'w22', winner: 'w22', method: '2ファール勝ち', note: 'レフリーズグリップ、ストラップ' },
            // 敗者復活戦決勝
            { id: 'waf2025-MM80-L-LF', round: 'LF', no: 0, slot: 1, a: 'w20', b: 'w22', winner: 'w20', method: 'ピン勝ち' },
            // 決勝（Excel 43・44行目）
            { id: 'waf2025-MM80-L-F', round: 'F', no: 0, slot: 1, a: 'w21', b: 'w20', winner: 'w20', method: 'ピン勝ち', note: 'ストラップ' },
            { id: 'waf2025-MM80-L-F2', round: 'F2', no: 0, slot: 1, a: 'w21', b: 'w20', winner: 'w20', method: 'ピン勝ち' },
          ],
        },
        {
          // 出典: WAF2025_マスターズ80㎏右.xlsx（一部の試合が欠けているため incomplete）
          classId: 'MM80', arm: 'R', format: 'double', incomplete: true,
          note: '本戦3回戦以降・敗者復活戦2回戦以降・敗者復活戦決勝のデータが未登録です。',
          entries: ['w21', 'w20', 'w37', 'w22', 'w25', 'w28', 'w29', 'w23', 'w38', 'w30', 'w27', 'w40', 'w41', 'w34', 'w31', 'w42', 'w26', 'p01', 'w39', 'w33', 'w32', 'w24', 'w36'],
          matches: [
            // 本戦1回戦
            { id: 'waf2025-MM80-R-W1-1', round: 'W', no: 1, slot: 1, a: 'w25', b: 'w36', winner: 'w25', method: 'ピン勝ち' },
            { id: 'waf2025-MM80-R-W1-2', round: 'W', no: 1, slot: 2, a: 'w22', b: 'w20', winner: 'w20', method: 'ピン勝ち', note: 'ストラップ' },
            { id: 'waf2025-MM80-R-W1-3', round: 'W', no: 1, slot: 3, a: 'w28', b: 'w38', winner: 'w28', method: '不戦勝' },
            { id: 'waf2025-MM80-R-W1-4', round: 'W', no: 1, slot: 4, a: 'w24', b: 'w26', winner: 'w26', method: 'ピン勝ち' },
            { id: 'waf2025-MM80-R-W1-5', round: 'W', no: 1, slot: 5, a: 'w32', b: 'w40', winner: 'w40', method: 'ピン勝ち' },
            { id: 'waf2025-MM80-R-W1-6', round: 'W', no: 1, slot: 6, a: 'w34', b: 'w42', winner: 'w42', method: 'ピン勝ち', note: 'レフリーズグリップ' },
            { id: 'waf2025-MM80-R-W1-7', round: 'W', no: 1, slot: 7, a: 'w23', b: 'w21', winner: 'w21', method: 'ピン勝ち', note: 'ストラップ' },
            { id: 'waf2025-MM80-R-W1-8', round: 'W', no: 1, slot: 8, a: 'w33', b: 'w37', winner: 'w37', method: 'ピン勝ち' },
            { id: 'waf2025-MM80-R-W1-9', round: 'W', no: 1, slot: 9, a: 'w30', b: 'w41', winner: 'w30', method: 'ピン勝ち' },
            { id: 'waf2025-MM80-R-W1-10', round: 'W', no: 1, slot: 10, a: 'w31', b: 'w39', winner: 'w31', method: 'ピン勝ち' },
            { id: 'waf2025-MM80-R-W1-11', round: 'W', no: 1, slot: 11, a: 'w27', b: 'w29', winner: 'w27', method: 'ピン勝ち' },
            // 本戦2回戦
            { id: 'waf2025-MM80-R-W2-1', round: 'W', no: 2, slot: 1, a: 'p01', b: 'w25', winner: 'w25', method: 'ピン勝ち', note: 'Excelでは「本戦1回戦目」表記。Alanisの2試合目のため2回戦として登録（加藤は1回戦シード）' },
            { id: 'waf2025-MM80-R-W2-2', round: 'W', no: 2, slot: 2, a: 'w20', b: 'w28', winner: 'w20', method: 'ピン勝ち', note: 'レフリーズグリップ、ストラップ' },
            { id: 'waf2025-MM80-R-W2-3', round: 'W', no: 2, slot: 3, a: 'w26', b: 'w40', winner: 'w40', method: 'ピン勝ち', note: 'レフリーズグリップ、プロテスト' },
            { id: 'waf2025-MM80-R-W2-4', round: 'W', no: 2, slot: 4, a: 'w42', b: 'w21', winner: 'w21', method: '2ファール勝ち' },
            { id: 'waf2025-MM80-R-W2-5', round: 'W', no: 2, slot: 5, a: 'w37', b: 'w30', winner: 'w37', method: 'ピン勝ち' },
            { id: 'waf2025-MM80-R-W2-6', round: 'W', no: 2, slot: 6, a: 'w31', b: 'w27', winner: 'w27', method: '2ファール勝ち' },
            // 敗者復活戦1回戦
            { id: 'waf2025-MM80-R-L1-1', round: 'L', no: 1, slot: 1, a: 'w36', b: 'w22', winner: 'w22', method: 'ルーザーポジション勝ち', note: '勝ち方は要確認（Excelの記載のまま）' },
            { id: 'waf2025-MM80-R-L1-2', round: 'L', no: 1, slot: 2, a: 'w38', b: 'w24', winner: 'w38', method: 'ピン勝ち', note: 'レフリーズグリップ、ストラップ' },
            // 決勝
            { id: 'waf2025-MM80-R-F', round: 'F', no: 0, slot: 1, a: 'w21', b: 'w20', winner: 'w21', method: 'ピン勝ち', note: 'ストラップ' },
          ],
        },
        { classId: 'MM90', arm: 'R', format: 'double', matches: [], entries: ['w43', 'w44', 'w45', 'w46', 'w47', 'w48', 'w49', 'w50', 'w51', 'w52', 'w53', 'w54', 'w55', 'w56', 'w57', 'w58', 'w59', 'w60'] },
        { classId: 'MM90', arm: 'L', format: 'double', matches: [], entries: ['w43', 'w61', 'w47', 'w50', 'w46', 'w55', 'w62', 'w56', 'w44', 'w54', 'w59', 'w63', 'w52', 'w53', 'w51', 'w58', 'w57'] },
      ],
    },
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
    // 2025 WAF世界選手権 マスターズ男子 -80kg 左腕（Excel D列〜E列の時刻を秒に換算）
    'waf2025-MM80-L-W1-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 255, end: 350 }, // No.2 0:04:15〜0:05:50
    'waf2025-MM80-L-W1-2': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 381, end: 455 }, // No.3 0:06:21〜0:07:35
    'waf2025-MM80-L-W1-3': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 485, end: 646 }, // No.4 0:08:05〜0:10:46
    'waf2025-MM80-L-W1-4': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 677, end: 850 }, // No.5 0:11:17〜0:14:10
    'waf2025-MM80-L-W1-5': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 878, end: 964 }, // No.6 0:14:38〜0:16:04
    'waf2025-MM80-L-W1-6': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 981, end: 1077 }, // No.7 0:16:21〜0:17:57
    'waf2025-MM80-L-W1-7': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 1108, end: 1236 }, // No.8 0:18:28〜0:20:36
    'waf2025-MM80-L-W1-8': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 1270, end: 1306 }, // No.9 0:21:10〜0:21:46
    'waf2025-MM80-L-W1-9': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 1340, end: 1436 }, // No.10 0:22:20〜0:23:56
    'waf2025-MM80-L-W2-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 1468, end: 1586 }, // No.11 0:24:28〜0:26:26
    'waf2025-MM80-L-W2-2': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 1601, end: 1690 }, // No.12 0:26:41〜0:28:10
    'waf2025-MM80-L-W2-3': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 1727, end: 1822 }, // No.13 0:28:47〜0:30:22
    'waf2025-MM80-L-W2-4': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 1856, end: 1945 }, // No.14 0:30:56〜0:32:25
    'waf2025-MM80-L-W2-5': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 1955, end: 2214 }, // No.15 0:32:35〜0:36:54
    'waf2025-MM80-L-W2-6': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 2246, end: 2470 }, // No.16 0:37:26〜0:41:10
    'waf2025-MM80-L-L1-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 2575, end: 2623 }, // No.18 0:42:55〜0:43:43
    'waf2025-MM80-L-L1-2': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 2642, end: 2740 }, // No.19 0:44:02〜0:45:40
    'waf2025-MM80-L-L1-3': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 2770, end: 3187 }, // No.20 0:46:10〜0:53:07
    'waf2025-MM80-L-L1-4': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 3219, end: 3285 }, // No.21 0:53:39〜0:54:45
    'waf2025-MM80-L-W3-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 3320, end: 3545 }, // No.22 0:55:20〜0:59:05
    'waf2025-MM80-L-W3-2': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 3555, end: 3635 }, // No.23 0:59:15〜1:00:35
    'waf2025-MM80-L-W3-3': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 3650, end: 4010 }, // No.24 1:00:50〜1:06:50
    'waf2025-MM80-L-L2-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 4038, end: 4243 }, // No.25 1:07:18〜1:10:43
    'waf2025-MM80-L-L2-2': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 4274, end: 4396 }, // No.26 1:11:14〜1:13:16
    'waf2025-MM80-L-L2-3': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 4436, end: 4576 }, // No.27 1:13:56〜1:16:16
    'waf2025-MM80-L-L2-4': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 4601, end: 4695 }, // No.28 1:16:41〜1:18:15
    'waf2025-MM80-L-L2-5': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 4726, end: 4916 }, // No.29 1:18:46〜1:21:56
    'waf2025-MM80-L-W4-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 4956, end: 5220 }, // No.30 1:22:36〜1:27:00
    'waf2025-MM80-L-L3-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 5255, end: 5386 }, // No.31 1:27:35〜1:29:46
    'waf2025-MM80-L-L3-2': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 5418, end: 5650 }, // No.32 1:30:18〜1:34:10
    'waf2025-MM80-L-L3-3': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 5680, end: 5792 }, // No.33 1:34:40〜1:36:32
    'waf2025-MM80-L-L3-4': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 5810, end: 6047 }, // No.34 1:36:50〜1:40:47
    'waf2025-MM80-L-L3-5': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 6080, end: 6175 }, // No.35 1:41:20〜1:42:55
    'waf2025-MM80-L-L4-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 6241, end: 6605 }, // No.36 1:44:01〜1:50:05
    'waf2025-MM80-L-L4-2': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 6640, end: 6675 }, // No.37 1:50:40〜1:51:15
    'waf2025-MM80-L-L5-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 6705, end: 6869 }, // No.38 1:51:45〜1:54:29
    'waf2025-MM80-L-WF': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 6900, end: 7110 }, // No.39 1:55:00〜1:58:30
    'waf2025-MM80-L-L6-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 7131, end: 7680 }, // No.40 1:58:51〜2:08:00
    'waf2025-MM80-L-LF': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 7710, end: 7830 }, // No.41 2:08:30〜2:10:30
    // 決勝（別動画。Excelの時刻は「時:分」で保存されていたため「分:秒」として換算）
    'waf2025-MM80-L-F': { url: 'https://www.youtube.com/watch?v=POuaCNJsUcY', start: 1304, end: 1484 }, // No.42 0:21:44〜0:24:44
    'waf2025-MM80-L-F2': { url: 'https://www.youtube.com/watch?v=POuaCNJsUcY', start: 1675, end: 1730 }, // No.43 0:27:55〜0:28:50
    // 2025 WAF世界選手権 マスターズ男子 -80kg 右腕（Excelの時刻を秒に換算）
    'waf2025-MM80-R-W1-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 8820, end: 8880 }, // No.1 2:27:00〜2:28:00
    'waf2025-MM80-R-W1-2': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 8910, end: 9090 }, // No.2 2:28:30〜2:31:30
    'waf2025-MM80-R-W1-3': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 9120, end: 9210 }, // No.3 2:32:00〜2:33:30
    'waf2025-MM80-R-W1-4': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 9240, end: 9330 }, // No.4 2:34:00〜2:35:30
    'waf2025-MM80-R-W1-5': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 9360, end: 9390 }, // No.5 2:36:00〜2:36:30
    'waf2025-MM80-R-W1-6': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 9420, end: 9540 }, // No.6 2:37:00〜2:39:00
    'waf2025-MM80-R-W1-7': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 9570, end: 9870 }, // No.7 2:39:30〜2:44:30
    'waf2025-MM80-R-W1-8': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 9900, end: 9990 }, // No.8 2:45:00〜2:46:30
    'waf2025-MM80-R-W1-9': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 10020, end: 10080 }, // No.9 2:47:00〜2:48:00
    'waf2025-MM80-R-W1-10': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 10110, end: 10170 }, // No.10 2:48:30〜2:49:30
    'waf2025-MM80-R-W1-11': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 10200, end: 10260 }, // No.11 2:50:00〜2:51:00
    'waf2025-MM80-R-W2-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 10290, end: 10350 }, // No.12 2:51:30〜2:52:30
    'waf2025-MM80-R-W2-2': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 10380, end: 10620 }, // No.13 2:53:00〜2:57:00
    'waf2025-MM80-R-W2-3': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 10650, end: 10860 }, // No.14 2:57:30〜3:01:00
    'waf2025-MM80-R-W2-4': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 10890, end: 11610 }, // No.15 3:01:30〜3:13:30
    'waf2025-MM80-R-W2-5': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 11640, end: 11730 }, // No.16 3:14:00〜3:15:30
    'waf2025-MM80-R-W2-6': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 11790, end: 11880 }, // No.17 3:16:30〜3:18:00
    'waf2025-MM80-R-L1-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 11940, end: 11970 }, // No.18 3:19:00〜3:19:30
    'waf2025-MM80-R-L1-2': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 12000, end: 12240 }, // No.19 3:20:00〜3:24:00
    'waf2025-MM80-R-F': { url: 'https://www.youtube.com/watch?v=POuaCNJsUcY', start: 6597, end: 6780 }, // No.20 1:49:57〜1:53:00
  },
};
