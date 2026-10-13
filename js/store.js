// データアクセス層。画面(app.js)はここのAPIだけを使う。
// バックエンド導入時は、この中身を fetch('/api/...') に置き換えれば画面側はほぼそのまま使える。
window.Store = (() => {
  'use strict';
  const D = window.AW_DATA;
  const VKEY = 'aw.videos.v1';

  const ROUNDS = {
    F: { label: '決勝', order: 4 },
    '3P': { label: '3位決定戦', order: 3 },
    SF2: { label: '準決勝', order: 2 },
    SF1: { label: '準決勝', order: 1 },
  };
  const POINTS = [10, 7, 5, 3]; // ランキングポイント（1位〜4位）

  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function readOverrides() {
    try { return JSON.parse(localStorage.getItem(VKEY)) || {}; } catch (e) { return {}; }
  }
  function writeOverrides(o) {
    try { localStorage.setItem(VKEY, JSON.stringify(o)); return true; } catch (e) { return false; }
  }

  const classList = D.classes;
  const classMap = new Map(classList.map((c) => [c.id, c]));
  const classIdx = (id) => classList.findIndex((c) => c.id === id);
  const athleteMap = new Map(D.athletes.map((a) => [a.id, a]));
  const tournamentList = [...D.tournaments].sort((x, y) => y.date.localeCompare(x.date));
  const tournamentMap = new Map(tournamentList.map((t) => [t.id, t]));

  // ---- 順位表から試合を生成 ----
  const baseMatches = [];
  const placements = [];
  for (const t of D.tournaments) {
    for (const [classId, arms] of Object.entries(t.results)) {
      for (const [arm, p] of Object.entries(arms)) {
        p.forEach((athleteId, i) => placements.push({ tournamentId: t.id, classId, arm, athleteId, place: i + 1 }));
        const pairs = { SF1: [p[0], p[3]], SF2: [p[1], p[2]], '3P': [p[2], p[3]], F: [p[0], p[1]] };
        for (const [round, [winner, loser]] of Object.entries(pairs)) {
          const id = `${t.id}-${classId}-${arm}-${round}`;
          const h = hash(id);
          const r = h % 100;
          const swap = (h >>> 3) % 2 === 0;
          baseMatches.push({
            id, tournamentId: t.id, date: t.date, classId, arm, round,
            roundLabel: ROUNDS[round].label, roundOrder: ROUNDS[round].order,
            a: swap ? loser : winner, b: swap ? winner : loser, winner, loser,
            method: r < 80 ? 'ピン勝ち' : r < 95 ? 'ファウル勝ち' : '棄権',
            seconds: r < 95 ? 2 + ((h >>> 8) % 44) : 0,
          });
        }
      }
    }
  }
  baseMatches.sort((x, y) =>
    y.date.localeCompare(x.date) ||
    classIdx(x.classId) - classIdx(y.classId) ||
    x.arm.localeCompare(y.arm) * -1 || // R → L
    y.roundOrder - x.roundOrder);
  const baseMatchMap = new Map(baseMatches.map((m) => [m.id, m]));

  function videoOf(id) {
    const ov = readOverrides();
    const v = Object.prototype.hasOwnProperty.call(ov, id) ? ov[id] : D.videos[id];
    return v && v.url ? { url: v.url, start: v.start || 0, local: !!ov[id] } : null;
  }
  const withVideo = (m) => ({ ...m, video: videoOf(m.id) });

  // ---- 公開API ----
  function matches(f = {}) {
    return baseMatches
      .filter((m) =>
        (!f.tournamentId || m.tournamentId === f.tournamentId) &&
        (!f.classId || m.classId === f.classId) &&
        (!f.arm || m.arm === f.arm) &&
        (!f.athleteId || m.a === f.athleteId || m.b === f.athleteId) &&
        (!f.opponentId || m.a === f.opponentId || m.b === f.opponentId))
      .map(withVideo)
      .filter((m) => !f.withVideo || m.video);
  }

  function standings(tournamentId, classId, arm) {
    return placements
      .filter((p) => p.tournamentId === tournamentId && p.classId === classId && p.arm === arm)
      .sort((x, y) => x.place - y.place);
  }

  function rankings(classId, arm) {
    const agg = new Map();
    for (const p of placements) {
      if (p.classId !== classId || p.arm !== arm) continue;
      const r = agg.get(p.athleteId) || { athleteId: p.athleteId, points: 0, titles: 0, entries: 0 };
      r.points += POINTS[p.place - 1] || 0;
      r.entries++;
      if (p.place === 1) r.titles++;
      agg.set(p.athleteId, r);
    }
    return [...agg.values()].sort((x, y) => y.points - x.points || y.titles - x.titles);
  }

  function athleteStats(id) {
    const ms = matches({ athleteId: id });
    const s = { wins: 0, losses: 0, pins: 0, byArm: { R: { w: 0, l: 0 }, L: { w: 0, l: 0 } }, streak: null };
    const opp = new Map();
    for (const m of ms) {
      const won = m.winner === id;
      const o = m.a === id ? m.b : m.a;
      const rec = opp.get(o) || { athleteId: o, w: 0, l: 0 };
      if (won) { s.wins++; s.byArm[m.arm].w++; rec.w++; if (m.method === 'ピン勝ち') s.pins++; }
      else { s.losses++; s.byArm[m.arm].l++; rec.l++; }
      opp.set(o, rec);
    }
    if (ms.length) {
      const first = ms[0].winner === id;
      let n = 0;
      for (const m of ms) { if ((m.winner === id) === first) n++; else break; }
      s.streak = { win: first, count: n };
    }
    s.total = s.wins + s.losses;
    s.places = placements
      .filter((p) => p.athleteId === id)
      .map((p) => ({ ...p, tournament: tournamentMap.get(p.tournamentId) }))
      .sort((x, y) => y.tournament.date.localeCompare(x.tournament.date) || x.arm.localeCompare(y.arm) * -1);
    s.titles = s.places.filter((p) => p.place === 1).length;
    s.medals = s.places.filter((p) => p.place <= 3).length;
    s.opponents = [...opp.values()].sort((x, y) => (y.w + y.l) - (x.w + x.l));
    s.matches = ms;
    return s;
  }

  function headToHead(a, b) {
    const ms = matches({ athleteId: a, opponentId: b });
    return { matches: ms, aWins: ms.filter((m) => m.winner === a).length, bWins: ms.filter((m) => m.winner === b).length };
  }

  function setVideo(id, url, start) {
    const ov = readOverrides();
    ov[id] = { url, start: start || 0 };
    return writeOverrides(ov);
  }
  function removeVideo(id) {
    const ov = readOverrides();
    if (D.videos[id]) ov[id] = { url: '' }; // data.js側の動画を非表示にする
    else delete ov[id];
    return writeOverrides(ov);
  }
  function exportVideos() {
    const out = { ...D.videos };
    for (const [k, v] of Object.entries(readOverrides())) {
      if (v.url) out[k] = v; else delete out[k];
    }
    return out;
  }

  return {
    classes: () => classList,
    cls: (id) => classMap.get(id),
    athletes: () => D.athletes,
    athlete: (id) => athleteMap.get(id),
    tournaments: () => tournamentList,
    tournament: (id) => tournamentMap.get(id),
    matches,
    match: (id) => (baseMatchMap.has(id) ? withVideo(baseMatchMap.get(id)) : null),
    standings, rankings, athleteStats, headToHead,
    setVideo, removeVideo, exportVideos,
  };
})();
