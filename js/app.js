(() => {
  'use strict';
  const S = window.Store;
  const app = document.getElementById('app');

  // ---------- ユーティリティ ----------
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtDate = (d) => d.replace(/-/g, '.');
  const fmtSec = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const pct = (w, t) => (t ? Math.round((w / t) * 100) : 0);
  const ARM = { R: '右腕', L: '左腕' };
  const opt = (v, label, sel) => `<option value="${esc(v)}"${v === sel ? ' selected' : ''}>${esc(label)}</option>`;

  function parseYouTube(url) {
    try {
      const u = new URL(url);
      let id = null;
      if (u.hostname === 'youtu.be') id = u.pathname.slice(1);
      else if (/(^|\.)youtube(-nocookie)?\.com$/.test(u.hostname)) {
        id = u.searchParams.get('v');
        if (!id) { const m = u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{11})/); id = m && m[1]; }
      }
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    } catch (e) { return null; }
  }
  // "90" / "1:30" / "1m30s" → 秒
  function parseStart(str) {
    if (!str) return 0;
    str = String(str).trim();
    if (/^\d+$/.test(str)) return +str;
    if (/^\d+:\d{1,2}$/.test(str)) { const [m, s] = str.split(':'); return +m * 60 + +s; }
    const m = str.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
    return m ? (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0) : 0;
  }
  function startFromUrl(url) {
    try { return parseStart(new URL(url).searchParams.get('t')); } catch (e) { return 0; }
  }

  // ---------- 共通パーツ ----------
  function avatar(a, size = '') {
    let h = 0;
    for (const c of a.id + a.name) h = (h * 31 + c.charCodeAt(0)) % 360;
    return `<span class="avatar ${size}" style="--hue:${h}" aria-hidden="true">${esc(a.name.charAt(0))}</span>`;
  }
  const athleteLink = (a) => `<a href="#/athletes/${a.id}">${esc(a.name)}</a>`;
  const chip = (text, cls = '') => `<span class="chip ${cls}">${esc(text)}</span>`;
  const armChip = (arm) => chip(ARM[arm], `arm-${arm}`);
  const placeMark = (p) => `<span class="place p${p}">${p}</span>`;
  const empty = (msg) => `<div class="empty">${esc(msg)}</div>`;

  function matchRow(m, pov) {
    const t = S.tournament(m.tournamentId);
    const A = S.athlete(m.a), B = S.athlete(m.b);
    const side = (x) => `<span class="mr-side ${m.winner === x.id ? 'win' : ''}">${avatar(x, 'sm')}<span>${esc(x.name)}</span></span>`;
    const badge = pov ? (m.winner === pov ? '<span class="badge w">WIN</span>' : '<span class="badge l">LOSS</span>') : '';
    return `<a class="match-row" href="#/matches/${m.id}">
      ${badge}
      <span class="mr-meta">
        <span class="mr-date">${fmtDate(t.date)} ${esc(t.short)}</span>
        <span class="chips">${chip(S.cls(m.classId).name)}${armChip(m.arm)}${chip(m.roundLabel, m.round === 'F' ? 'final' : '')}</span>
      </span>
      <span class="mr-vs">${side(A)}<span class="vs">VS</span>${side(B)}</span>
      <span class="mr-res">${esc(m.method)}${m.seconds ? ` <small>${fmtSec(m.seconds)}</small>` : ''}</span>
      <span class="mr-video" title="${m.video ? '動画あり' : '動画なし'}">${m.video ? '▶' : ''}</span>
    </a>`;
  }
  const matchList = (ms, pov) => (ms.length ? `<div class="list">${ms.map((m) => matchRow(m, pov)).join('')}</div>` : empty('該当する試合はありません'));

  function videoPlayer(v) {
    if (!v) return `<div class="video placeholder"><div><div class="ph-icon">▶</div><p>この試合の動画はまだ登録されていません</p></div></div>`;
    const yt = parseYouTube(v.url);
    if (yt) {
      return `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${yt}?start=${v.start | 0}&rel=0" title="試合動画"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
    }
    if (/\.(mp4|webm|ogg)(\?|#|$)/i.test(v.url)) {
      return `<div class="video"><video src="${esc(v.url)}#t=${v.start | 0}" controls preload="metadata"></video></div>`;
    }
    return `<div class="video placeholder"><div><div class="ph-icon">↗</div><a href="${esc(v.url)}" target="_blank" rel="noopener">外部サイトで動画を見る</a></div></div>`;
  }

  function videoThumb(m) {
    const yt = m.video && parseYouTube(m.video.url);
    const A = S.athlete(m.a), B = S.athlete(m.b), t = S.tournament(m.tournamentId);
    return `<a class="vthumb" href="#/matches/${m.id}">
      <span class="vthumb-img"${yt ? ` style="background-image:url('https://i.ytimg.com/vi/${yt}/hqdefault.jpg')"` : ''}><span class="play">▶</span></span>
      <span class="vthumb-title">${esc(A.name)} vs ${esc(B.name)}</span>
      <span class="vthumb-sub">${esc(t.short)} / ${esc(S.cls(m.classId).name)} ${ARM[m.arm]} ${m.roundLabel}</span>
    </a>`;
  }

  function segmented(name, items, current) {
    return `<div class="seg" role="tablist" data-seg="${name}">${items
      .map(([v, l]) => `<button type="button" role="tab" data-v="${esc(v)}" class="${v === current ? 'on' : ''}" aria-selected="${v === current}">${esc(l)}</button>`)
      .join('')}</div>`;
  }
  function bindSegmented(root, name, onChange) {
    const seg = root.querySelector(`[data-seg="${name}"]`);
    if (!seg) return;
    seg.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      seg.querySelectorAll('button').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
      onChange(b.dataset.v);
    });
  }

  // ---------- ビュー ----------
  function viewHome() {
    const ts = S.tournaments();
    const latest = ts[0];
    const all = S.matches();
    const vids = all.filter((m) => m.video);
    const latestMs = S.matches({ tournamentId: latest.id });
    const finals = latestMs.filter((m) => m.round === 'F');

    const champs = finals.map((m) => {
      const w = S.athlete(m.winner);
      return `<a class="champ" href="#/matches/${m.id}">
        <span class="champ-cls">${esc(S.cls(m.classId).name)} ${armChip(m.arm)}</span>
        <span class="champ-name">${avatar(w)}<span><strong>${esc(w.name)}</strong><small>${esc(w.team)}</small></span></span>
        <span class="champ-foot">決勝 ${esc(m.method)}${m.video ? ' ・ ▶ 動画あり' : ''}</span>
      </a>`;
    }).join('');

    const rankBlock = (arm) => S.classes().map((c) => {
      const rows = S.rankings(c.id, arm).slice(0, 5);
      return `<div class="card rank-card"><h3>${esc(c.name)}</h3><ol class="rank">${rows.map((r, i) => {
        const a = S.athlete(r.athleteId);
        return `<li>${placeMark(i + 1)}${avatar(a, 'sm')}<span class="grow">${athleteLink(a)}</span><span class="muted small">${r.titles ? `優勝${r.titles}` : ''}</span><strong>${r.points}pt</strong></li>`;
      }).join('')}</ol></div>`;
    }).join('');

    return {
      html: `
      <section class="hero">
        <div>
          <p class="eyebrow">ARMWRESTLING RESULTS DATABASE</p>
          <h1>大会・選手・対戦を、<br>動画で振り返る。</h1>
          <p class="lead">アームレスリングの大会成績、選手ごとの戦績、対戦カードの結果と試合動画をまとめて確認できます。</p>
          <div class="hero-actions">
            <a class="btn primary" href="#/tournaments/${latest.id}">最新大会の結果を見る</a>
            <a class="btn" href="#/h2h">対戦成績を比較</a>
          </div>
        </div>
        <div class="kpis">
          <div class="kpi"><strong>${ts.length}</strong><span>大会</span></div>
          <div class="kpi"><strong>${S.athletes().length}</strong><span>選手</span></div>
          <div class="kpi"><strong>${all.length}</strong><span>試合</span></div>
          <div class="kpi"><strong>${vids.length}</strong><span>動画</span></div>
        </div>
      </section>

      <section>
        <div class="sec-head"><h2>最新大会の優勝者 <small>${esc(latest.name)}（${fmtDate(latest.date)}）</small></h2><a href="#/tournaments/${latest.id}">トーナメント表 →</a></div>
        <div class="champ-grid">${champs}</div>
      </section>

      ${vids.length ? `<section><div class="sec-head"><h2>試合動画</h2><a href="#/matches?video=1">すべて見る →</a></div>
        <div class="vgrid">${vids.slice(0, 6).map(videoThumb).join('')}</div></section>` : ''}

      <section>
        <div class="sec-head"><h2>年間ランキング</h2>${segmented('rank', [['R', '右腕'], ['L', '左腕']], 'R')}</div>
        <p class="muted small">ポイント: 1位 10pt / 2位 7pt / 3位 5pt / 4位 3pt</p>
        <div class="grid3" data-rank>${rankBlock('R')}</div>
      </section>

      <section>
        <div class="sec-head"><h2>最近の試合</h2><a href="#/matches">試合一覧 →</a></div>
        ${matchList(latestMs.slice(0, 8))}
      </section>`,
      mount(root) {
        bindSegmented(root, 'rank', (arm) => { root.querySelector('[data-rank]').innerHTML = rankBlock(arm); });
      },
    };
  }

  function viewTournaments() {
    const cards = S.tournaments().map((t) => {
      const finals = S.matches({ tournamentId: t.id }).filter((m) => m.round === 'F');
      const n = S.matches({ tournamentId: t.id }).length;
      return `<a class="card t-card" href="#/tournaments/${t.id}">
        <div class="t-date"><span>${t.date.slice(0, 4)}</span><strong>${t.date.slice(5).replace('-', '/')}</strong></div>
        <div class="grow">
          <div class="chips">${chip(t.level)}</div>
          <h3>${esc(t.name)}</h3>
          <p class="muted">${esc(t.venue)} ・ ${Object.keys(t.results).length}階級 ・ ${n}試合</p>
          <ul class="t-champs">${finals.map((m) => `<li>${esc(S.cls(m.classId).name)} ${ARM[m.arm]}: <strong>${esc(S.athlete(m.winner).name)}</strong></li>`).join('')}</ul>
        </div>
      </a>`;
    }).join('');
    return { title: '大会一覧', html: `<h1 class="page-title">大会一覧</h1><div class="stack">${cards}</div>` };
  }

  function viewTournament(id, q) {
    const t = S.tournament(id);
    if (!t) return viewNotFound();
    const cids = Object.keys(t.results);
    const c = cids.includes(q.get('c')) ? q.get('c') : cids[0];
    const arms = Object.keys(t.results[c]);
    const arm = arms.includes(q.get('arm')) ? q.get('arm') : arms[0];
    const ms = S.matches({ tournamentId: id, classId: c, arm });
    const get = (r) => ms.find((m) => m.round === r);

    const box = (m) => {
      const line = (aid) => {
        const a = S.athlete(aid);
        return `<span class="bx-line ${m.winner === aid ? 'win' : ''}">${avatar(a, 'xs')}<span class="grow">${esc(a.name)}</span>${m.winner === aid ? '<b>WIN</b>' : ''}</span>`;
      };
      return `<a class="bx" href="#/matches/${m.id}">${line(m.a)}${line(m.b)}<span class="bx-foot">${esc(m.method)}${m.seconds ? ' ' + fmtSec(m.seconds) : ''}${m.video ? ' ・ ▶' : ''}</span></a>`;
    };
    const tab = (cc, aa, label, on) => `<a class="${on ? 'on' : ''}" href="#/tournaments/${id}?c=${cc}&arm=${aa}">${esc(label)}</a>`;

    return {
      title: t.name,
      html: `
      <nav class="crumbs"><a href="#/tournaments">大会一覧</a> / ${esc(t.short)}</nav>
      <header class="page-head">
        <div class="chips">${chip(t.level)}</div>
        <h1>${esc(t.name)}</h1>
        <p class="muted">${fmtDate(t.date)} ・ ${esc(t.venue)}</p>
      </header>
      <div class="tabs">${cids.map((cc) => tab(cc, arm, S.cls(cc).name, cc === c)).join('')}</div>
      <div class="tabs sub">${arms.map((aa) => tab(c, aa, ARM[aa], aa === arm)).join('')}</div>

      <div class="t-layout">
        <section class="card">
          <h2>トーナメント表 <small>${esc(S.cls(c).name)} ${ARM[arm]}</small></h2>
          <div class="bracket">
            <div class="bcol"><h4>準決勝</h4>${box(get('SF1'))}${box(get('SF2'))}</div>
            <div class="bcol"><h4>決勝</h4>${box(get('F'))}<h4>3位決定戦</h4>${box(get('3P'))}</div>
          </div>
        </section>
        <section class="card">
          <h2>最終順位</h2>
          <ol class="standings">${S.standings(id, c, arm).map((p) => {
            const a = S.athlete(p.athleteId);
            return `<li>${placeMark(p.place)}${avatar(a, 'sm')}<span class="grow">${athleteLink(a)}<small class="muted"> ${esc(a.team)}</small></span></li>`;
          }).join('')}</ol>
        </section>
      </div>

      <section><h2>試合結果</h2>${matchList(ms)}</section>`,
    };
  }

  function viewAthletes(q) {
    const listHtml = (kw, cid) => {
      kw = kw.trim().toLowerCase();
      const rows = S.athletes().filter((a) =>
        (!cid || a.classId === cid) &&
        (!kw || [a.name, a.nameEn, a.team, a.pref].some((x) => x.toLowerCase().includes(kw))));
      if (!rows.length) return empty('該当する選手はいません');
      return `<div class="agrid">${rows.map((a) => {
        const s = S.athleteStats(a.id);
        return `<a class="card a-card" href="#/athletes/${a.id}">
          ${avatar(a, 'lg')}
          <span class="grow">
            <strong>${esc(a.name)}</strong><small class="muted">${esc(a.nameEn)}</small>
            <span class="chips">${chip(S.cls(a.classId).name)}${chip(a.team)}</span>
          </span>
          <span class="a-rec"><strong>${s.wins}-${s.losses}</strong><small>${s.titles ? `優勝 ${s.titles}回` : `勝率 ${pct(s.wins, s.total)}%`}</small></span>
        </a>`;
      }).join('')}</div>`;
    };
    const cid0 = q.get('c') || '';
    return {
      title: '選手一覧',
      html: `
      <h1 class="page-title">選手一覧</h1>
      <div class="filters">
        <input type="search" id="kw" placeholder="選手名・チーム・都道府県で検索" aria-label="検索">
        <select id="cls" aria-label="階級"><option value="">すべての階級</option>${S.classes().map((c) => opt(c.id, c.name, cid0)).join('')}</select>
      </div>
      <div id="alist">${listHtml('', cid0)}</div>`,
      mount(root) {
        const kw = root.querySelector('#kw'), cls = root.querySelector('#cls'), out = root.querySelector('#alist');
        const upd = () => { out.innerHTML = listHtml(kw.value, cls.value); };
        kw.addEventListener('input', upd);
        cls.addEventListener('change', upd);
      },
    };
  }

  function viewAthlete(id) {
    const a = S.athlete(id);
    if (!a) return viewNotFound();
    const s = S.athleteStats(id);
    const armBar = (arm) => {
      const r = s.byArm[arm], t = r.w + r.l;
      return `<div class="armbar"><span class="armbar-l">${ARM[arm]}</span>
        <span class="bar"><span style="width:${pct(r.w, t)}%"></span></span>
        <span class="armbar-r"><strong>${r.w}-${r.l}</strong> <small class="muted">${pct(r.w, t)}%</small></span></div>`;
    };
    const histHtml = (arm) => matchList(arm ? s.matches.filter((m) => m.arm === arm) : s.matches, id);

    return {
      title: a.name,
      html: `
      <nav class="crumbs"><a href="#/athletes">選手一覧</a> / ${esc(a.name)}</nav>
      <header class="profile card">
        ${avatar(a, 'xl')}
        <div class="grow">
          <h1>${esc(a.name)} <small class="muted">${esc(a.nameEn)}</small></h1>
          <div class="chips">${chip(S.cls(a.classId).name)}${chip(a.team)}${chip(a.pref)}${chip(`利き腕: ${ARM[a.dominant]}`)}${chip(`競技歴: ${a.since}年〜`)}</div>
          <p>${esc(a.bio)}</p>
        </div>
      </header>

      <div class="stats">
        <div class="stat"><span>通算成績</span><strong>${s.wins}勝 ${s.losses}敗</strong></div>
        <div class="stat"><span>勝率</span><strong>${pct(s.wins, s.total)}%</strong></div>
        <div class="stat"><span>優勝 / メダル</span><strong>${s.titles} / ${s.medals}</strong></div>
        <div class="stat"><span>ピン勝ち率</span><strong>${pct(s.pins, s.wins)}%</strong></div>
        <div class="stat"><span>現在</span><strong>${s.streak ? `${s.streak.count}${s.streak.win ? '連勝' : '連敗'}` : '-'}</strong></div>
      </div>

      <div class="grid2">
        <section class="card">
          <h2>腕別成績</h2>${armBar('R')}${armBar('L')}
          <h2 class="mt">対戦相手別</h2>
          <ul class="opp">${s.opponents.map((o) => {
            const b = S.athlete(o.athleteId);
            return `<li>${avatar(b, 'sm')}<span class="grow">${athleteLink(b)}</span><span class="${o.w >= o.l ? 'pos' : 'neg'}">${o.w}-${o.l}</span><a class="btn xs" href="#/h2h?a=${id}&b=${b.id}">比較</a></li>`;
          }).join('')}</ul>
        </section>
        <section class="card">
          <h2>大会成績</h2>
          <table class="tbl"><thead><tr><th>日付</th><th>大会</th><th>腕</th><th>順位</th></tr></thead><tbody>
          ${s.places.map((p) => `<tr><td>${fmtDate(p.tournament.date)}</td><td><a href="#/tournaments/${p.tournamentId}?c=${p.classId}&arm=${p.arm}">${esc(p.tournament.short)}</a></td><td>${ARM[p.arm]}</td><td>${placeMark(p.place)}</td></tr>`).join('')}
          </tbody></table>
        </section>
      </div>

      <section>
        <div class="sec-head"><h2>試合履歴</h2>${segmented('hist', [['', 'すべて'], ['R', '右腕'], ['L', '左腕']], '')}</div>
        <div id="hist">${histHtml('')}</div>
      </section>`,
      mount(root) {
        bindSegmented(root, 'hist', (arm) => { root.querySelector('#hist').innerHTML = histHtml(arm); });
      },
    };
  }

  function viewMatches(q) {
    const st = { t: q.get('t') || '', c: q.get('c') || '', arm: q.get('arm') || '', video: q.get('video') === '1' };
    const listHtml = () => {
      const ms = S.matches({ tournamentId: st.t, classId: st.c, arm: st.arm, withVideo: st.video });
      return `<p class="muted small">${ms.length}件</p>${matchList(ms)}`;
    };
    return {
      title: '試合一覧',
      html: `
      <h1 class="page-title">試合一覧</h1>
      <div class="filters">
        <select data-k="t" aria-label="大会"><option value="">すべての大会</option>${S.tournaments().map((t) => opt(t.id, t.name, st.t)).join('')}</select>
        <select data-k="c" aria-label="階級"><option value="">すべての階級</option>${S.classes().map((c) => opt(c.id, c.name, st.c)).join('')}</select>
        <select data-k="arm" aria-label="腕"><option value="">右腕・左腕</option>${opt('R', '右腕', st.arm)}${opt('L', '左腕', st.arm)}</select>
        <label class="check"><input type="checkbox" data-k="video"${st.video ? ' checked' : ''}> 動画ありのみ</label>
      </div>
      <div id="mlist">${listHtml()}</div>`,
      mount(root) {
        root.querySelectorAll('[data-k]').forEach((el) => el.addEventListener('change', () => {
          st[el.dataset.k] = el.type === 'checkbox' ? el.checked : el.value;
          root.querySelector('#mlist').innerHTML = listHtml();
        }));
      },
    };
  }

  function viewMatch(id) {
    const m = S.match(id);
    if (!m) return viewNotFound();
    const t = S.tournament(m.tournamentId);
    const A = S.athlete(m.a), B = S.athlete(m.b);
    const h = S.headToHead(m.a, m.b);
    const others = h.matches.filter((x) => x.id !== m.id);
    const sameBracket = S.matches({ tournamentId: t.id, classId: m.classId, arm: m.arm }).filter((x) => x.id !== m.id);

    const fighter = (x) => {
      const s = S.athleteStats(x.id);
      return `<a class="fighter ${m.winner === x.id ? 'win' : 'lose'}" href="#/athletes/${x.id}">
        ${avatar(x, 'xl')}
        <strong>${esc(x.name)}</strong><small>${esc(x.team)}</small>
        <span class="muted small">通算 ${s.wins}-${s.losses}</span>
        <span class="result">${m.winner === x.id ? 'WIN' : 'LOSE'}</span>
      </a>`;
    };

    return {
      title: `${A.name} vs ${B.name}`,
      html: `
      <nav class="crumbs"><a href="#/tournaments/${t.id}?c=${m.classId}&arm=${m.arm}">${esc(t.short)}</a> / ${esc(S.cls(m.classId).name)} ${ARM[m.arm]} ${m.roundLabel}</nav>
      <div class="match-layout">
        <div>
          <div id="player">${videoPlayer(m.video)}</div>
          <details class="card vform" ${m.video ? '' : 'open'}>
            <summary>${m.video ? '動画を変更する' : '動画を登録する'}</summary>
            <form id="vf">
              <label>動画URL（YouTube / mp4 など）<input type="url" name="url" required placeholder="https://www.youtube.com/watch?v=..." value="${esc(m.video ? m.video.url : '')}"></label>
              <label>開始位置（秒 または 分:秒）<input type="text" name="start" placeholder="例: 1:25" value="${m.video && m.video.start ? fmtSec(m.video.start) : ''}"></label>
              <div class="row">
                <button class="btn primary" type="submit">保存</button>
                ${m.video && m.video.local ? '<button class="btn" type="button" id="vdel">登録を削除</button>' : ''}
                <span class="muted small" id="vmsg"></span>
              </div>
              <p class="muted small">※ プロトタイプでは、このブラウザにのみ保存されます。</p>
            </form>
          </details>
        </div>
        <aside>
          <div class="card match-card">
            <div class="chips center">${chip(S.cls(m.classId).name)}${armChip(m.arm)}${chip(m.roundLabel, m.round === 'F' ? 'final' : '')}</div>
            <div class="vs-wrap">${fighter(A)}<span class="vs big">VS</span>${fighter(B)}</div>
            <dl class="facts">
              <div><dt>決着</dt><dd>${esc(m.method)}</dd></div>
              <div><dt>試合時間</dt><dd>${m.seconds ? fmtSec(m.seconds) : '-'}</dd></div>
              <div><dt>大会</dt><dd><a href="#/tournaments/${t.id}?c=${m.classId}&arm=${m.arm}">${esc(t.name)}</a></dd></div>
              <div><dt>日付・会場</dt><dd>${fmtDate(t.date)} ${esc(t.venue)}</dd></div>
            </dl>
          </div>
          <div class="card">
            <h3>この2人の対戦成績</h3>
            <div class="h2h-mini"><span>${esc(A.name)}</span><strong>${h.aWins} - ${h.bWins}</strong><span>${esc(B.name)}</span></div>
            <a class="btn block" href="#/h2h?a=${A.id}&b=${B.id}">詳しく比較する</a>
          </div>
        </aside>
      </div>
      ${others.length ? `<section><h2>この2人の他の対戦</h2>${matchList(others)}</section>` : ''}
      <section><h2>同じブロックの試合</h2>${matchList(sameBracket)}</section>`,
      mount(root) {
        const f = root.querySelector('#vf');
        f.addEventListener('submit', (e) => {
          e.preventDefault();
          const url = f.url.value.trim();
          if (!/^https?:\/\//i.test(url)) { root.querySelector('#vmsg').textContent = 'http(s) のURLを入力してください'; return; }
          const start = f.start.value.trim() ? parseStart(f.start.value) : startFromUrl(url);
          if (!S.setVideo(id, url, start)) { root.querySelector('#vmsg').textContent = '保存に失敗しました'; return; }
          router();
        });
        const del = root.querySelector('#vdel');
        if (del) del.addEventListener('click', () => { S.removeVideo(id); router(); });
      },
    };
  }

  function viewH2H(q) {
    const list = S.athletes();
    let a = q.get('a') || list[0].id, b = q.get('b') || list[1].id;
    const sel = (name, cur) => `<select name="${name}" aria-label="選手">${S.classes().map((c) =>
      `<optgroup label="${esc(c.name)}">${list.filter((x) => x.classId === c.id).map((x) => opt(x.id, x.name, cur)).join('')}</optgroup>`).join('')}</select>`;

    const result = () => {
      if (a === b) return empty('異なる2人の選手を選んでください');
      const A = S.athlete(a), B = S.athlete(b);
      const h = S.headToHead(a, b);
      const sa = S.athleteStats(a), sb = S.athleteStats(b);
      const total = h.aWins + h.bWins;
      const cmp = (label, va, vb) => `<tr><td class="${va > vb ? 'pos' : ''}">${va}</td><th>${label}</th><td class="${vb > va ? 'pos' : ''}">${vb}</td></tr>`;
      return `
        <div class="card h2h-head">
          <a href="#/athletes/${a}" class="h2h-side">${avatar(A, 'xl')}<strong>${esc(A.name)}</strong><small class="muted">${esc(A.team)}</small></a>
          <div class="h2h-score"><strong>${h.aWins}<span>-</span>${h.bWins}</strong><small class="muted">直接対決 ${total}試合</small>
            ${total ? `<span class="bar dual"><span style="width:${pct(h.aWins, total)}%"></span></span>` : ''}</div>
          <a href="#/athletes/${b}" class="h2h-side">${avatar(B, 'xl')}<strong>${esc(B.name)}</strong><small class="muted">${esc(B.team)}</small></a>
        </div>
        <div class="card"><table class="cmp"><tbody>
          ${cmp('通算勝利', sa.wins, sb.wins)}
          ${cmp('勝率(%)', pct(sa.wins, sa.total), pct(sb.wins, sb.total))}
          ${cmp('優勝回数', sa.titles, sb.titles)}
          ${cmp('メダル数', sa.medals, sb.medals)}
          ${cmp('右腕 勝利', sa.byArm.R.w, sb.byArm.R.w)}
          ${cmp('左腕 勝利', sa.byArm.L.w, sb.byArm.L.w)}
        </tbody></table></div>
        <section><h2>直接対決</h2>${total ? matchList(h.matches, a) : empty('この2人の対戦記録はありません（階級が異なる可能性があります）')}</section>`;
    };

    return {
      title: '対戦比較',
      html: `
      <h1 class="page-title">対戦比較（Head to Head）</h1>
      <form class="filters" id="h2hf">${sel('a', a)}<span class="vs">VS</span>${sel('b', b)}</form>
      <div id="h2hout">${result()}</div>`,
      mount(root) {
        const f = root.querySelector('#h2hf');
        f.addEventListener('change', () => {
          a = f.a.value; b = f.b.value;
          history.replaceState(null, '', `#/h2h?a=${a}&b=${b}`);
          root.querySelector('#h2hout').innerHTML = result();
        });
      },
    };
  }

  function viewNotFound() {
    return { title: 'ページが見つかりません', html: `<div class="empty big"><h1>404</h1><p>ページが見つかりません。</p><a class="btn" href="#/">トップへ戻る</a></div>` };
  }

  // ---------- ルーター ----------
  const routes = [
    [/^\/?$/, () => viewHome()],
    [/^\/tournaments$/, () => viewTournaments()],
    [/^\/tournaments\/([\w-]+)$/, (id, q) => viewTournament(id, q)],
    [/^\/athletes$/, (q) => viewAthletes(q)],
    [/^\/athletes\/([\w-]+)$/, (id) => viewAthlete(id)],
    [/^\/matches$/, (q) => viewMatches(q)],
    [/^\/matches\/([\w-]+)$/, (id) => viewMatch(id)],
    [/^\/h2h$/, (q) => viewH2H(q)],
  ];

  let lastPath = null;
  function router() {
    const [path, qs] = (location.hash.slice(1) || '/').split('?');
    const q = new URLSearchParams(qs || '');
    let view = null;
    for (const [re, fn] of routes) {
      const m = path.match(re);
      if (m) { view = fn(...m.slice(1), q); break; }
    }
    view = view || viewNotFound();
    app.innerHTML = view.html;
    if (view.mount) view.mount(app);
    document.title = (view.title ? `${view.title} | ` : '') + 'ARM RESULTS';
    const section = path.split('/')[1] || 'home';
    document.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('on', a.dataset.nav === section));
    if (path !== lastPath) window.scrollTo(0, 0);
    lastPath = path;
  }

  document.getElementById('export').addEventListener('click', () => {
    const json = JSON.stringify(S.exportVideos(), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'videos.json';
    link.click();
    URL.revokeObjectURL(link.href);
  });

  window.addEventListener('hashchange', router);
  router();
})();
