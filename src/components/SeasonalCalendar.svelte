<script>
  /**
   * Interactive seasonal hazard calendar (ACAPS-derived).
   * Props:
   *   tabs:   [{ key, label, calendar }]  calendar = parsed object from src/data/calendars.json
   *   window: ['2026-10', ...]             twelve months shown
   *   today:  ISO date string for the "today" marker
   */
  let { tabs = [], window = [], today = null, id = 'cal' } = $props();

  const SECTIONS = [
    { key: 'Seasonal hazard', label: 'Seasonal hazard', color: '#418fde' },
    { key: 'Outbreak', label: 'Disease outbreak', color: '#d22630' },
    { key: 'Lean season', label: 'Lean season', color: '#ff671f' },
    { key: 'Planting and growing', label: 'Planting & growing', color: '#5cb8b2' },
    { key: 'Harvest', label: 'Harvest', color: '#ffb81c' },
  ];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthLabel = (ym) => { const [y, m] = ym.split('-'); return { m: MONTHS[+m - 1], y: y.slice(2) }; };

  let active = $state(tabs[0]?.key);
  let hidden = $state({});
  let current = $derived(tabs.find((t) => t.key === active)?.calendar);

  let groups = $derived.by(() => {
    if (!current) return [];
    return SECTIONS.map((s) => ({ ...s, rows: current.events.filter((e) => e.section === s.key) })).filter((g) => g.rows.length);
  });

  // count of hazard / lean / outbreak events active in each month
  let pressure = $derived.by(() => {
    const m = new Array(12).fill(0);
    if (!current) return m;
    for (const e of current.events) {
      if (!['Seasonal hazard', 'Lean season', 'Outbreak'].includes(e.section)) continue;
      const seen = new Set();
      for (const [a, b] of e.bars) for (let i = a; i <= b; i++) seen.add(i);
      seen.forEach((i) => (m[i] += 1));
    }
    return m;
  });
  let maxP = $derived(Math.max(1, ...pressure));

  let todayPos = $derived.by(() => {
    if (!today || !window.length) return null;
    const d = new Date(today);
    const [y0, m0] = window[0].split('-').map(Number);
    const idx = (d.getFullYear() - y0) * 12 + (d.getMonth() + 1 - m0);
    if (idx < 0 || idx > 11) return null;
    const dim = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    return ((idx + (d.getDate() - 0.5) / dim) / 12) * 100;
  });

  const stripRefs = (s) => (s || '').replace(/\[\^[^\]]+\]/g, '');
  const toggle = (k) => (hidden = { ...hidden, [k]: !hidden[k] });
</script>

<div class="cal">
  {#if tabs.length > 1}
    <div class="cal__tabs" role="tablist" aria-label="Calendar area">
      {#each tabs as t}
        <button role="tab" id={`${id}-tab-${t.key}`} aria-selected={active === t.key} aria-controls={`${id}-panel`} class:on={active === t.key} onclick={() => (active = t.key)}>{t.label}</button>
      {/each}
    </div>
  {/if}

  {#if current}
    <div id={`${id}-panel`} role="tabpanel" aria-labelledby={tabs.length > 1 ? `${id}-tab-${active}` : undefined}>
      <div class="cal__legend" aria-label="Filter categories">
        {#each SECTIONS as s}
          {#if current.events.some((e) => e.section === s.key)}
            <button class="chip" class:off={hidden[s.key]} aria-pressed={!hidden[s.key]} onclick={() => toggle(s.key)}>
              <span class="sw" style={`background:${s.color}`}></span>{s.label}
            </button>
          {/if}
        {/each}
      </div>

      <div class="cal__grid" style="--cols:12">
        <div class="cal__head">
          <div class="cal__label"></div>
          <div class="cal__months">
            {#each window as ym, i}
              {@const l = monthLabel(ym)}
              <div class="mh" class:yr={l.m === 'Jan' || i === 0}><span>{l.m}</span>{#if l.m === 'Jan' || i === 0}<small>’{l.y}</small>{/if}</div>
            {/each}
          </div>
        </div>

        <div class="cal__row cal__row--pressure">
          <div class="cal__label"><strong>Household pressure</strong><small>hazard + lean + outbreak</small></div>
          <div class="cal__months">
            {#each pressure as p, i}
              <div class="heat" style={`--a:${p / maxP};color:${p / maxP < 0.5 ? "#7a2e0a" : "#fff"}`} title={`${window[i]}: ${p} overlapping pressure event(s)`}><span>{p || ''}</span></div>
            {/each}
          </div>
        </div>

        {#each groups as g}
          {#if !hidden[g.key]}
            <div class="cal__group" style={`--c:${g.color}`}>{g.label} <span>({g.rows.length})</span></div>
            {#each g.rows as e}
              <div class="cal__row">
                <div class="cal__label" title={e.label}>{e.label}<small>{e.span}</small></div>
                <div class="cal__months track">
                  {#each e.bars as [a, b]}
                    <span class="bar" style={`left:${(a / 12) * 100}%;width:${((b - a + 1) / 12) * 100}%;background:${g.color}`} title={`${e.label} [${e.span}]`}></span>
                  {/each}
                  {#if todayPos !== null}<span class="today" style={`left:${todayPos}%`}></span>{/if}
                </div>
              </div>
            {/each}
          {/if}
        {/each}
      </div>
      {#if todayPos !== null}<p class="cal__today-note"><span class="today-key"></span> Today. Events are recurring seasonal patterns, not forecasts.</p>{/if}

      {#if current.indicative}
        <div class="cal__reading"><strong>Indicative reading.</strong> {stripRefs(current.indicative)}</div>
      {/if}
      {#if current.prose?.length}
        <details class="more">
          <summary>Calendar narrative &amp; sources</summary>
          {#each current.prose as p}<p class="small">{stripRefs(p)}</p>{/each}
          {#if current.sources_note}<p class="small muted">{current.sources_note}</p>{/if}
          <ul class="small sources">
            {#each Object.entries(current.footnotes || {}).filter(([k], i, arr) => arr.findIndex(([, v]) => v.url === current.footnotes[k].url) === i) as [k, f]}
              <li>{f.text} {#if f.url}<a href={f.url} rel="noopener">{f.url.replace(/^https?:\/\//, '').slice(0, 60)}</a>{/if}</li>
            {/each}
          </ul>
        </details>
      {/if}
    </div>
  {:else}
    <p class="muted">No calendar available.</p>
  {/if}
</div>

<style>
  .cal { background: #fff; border: 1px solid var(--line); border-radius: var(--radius); padding: 1rem; box-shadow: var(--shadow); }
  .cal__tabs { display: flex; flex-wrap: wrap; gap: .35rem; margin-bottom: .9rem; border-bottom: 1px solid var(--line); }
  .cal__tabs button {
    font: inherit; font-size: .85rem; font-weight: 700; background: none; border: 0; border-bottom: 3px solid transparent;
    padding: .45rem .7rem; color: var(--ink-2); cursor: pointer; margin-bottom: -1px;
  }
  .cal__tabs button.on { color: var(--iom-blue); border-bottom-color: var(--iom-yellow); }
  .cal__legend { display: flex; flex-wrap: wrap; gap: .4rem; margin-bottom: .9rem; }
  .chip {
    display: inline-flex; align-items: center; gap: .4rem; font: inherit; font-size: .78rem; font-weight: 600;
    border: 1px solid var(--line); background: #fff; border-radius: 999px; padding: .2rem .65rem; cursor: pointer; color: var(--ink);
  }
  .chip.off { opacity: .45; text-decoration: line-through; }
  .sw { width: .7rem; height: .7rem; border-radius: 2px; display: inline-block; }

  .cal__grid { font-size: .8rem; overflow-x: auto; }
  .cal__head, .cal__row { display: grid; grid-template-columns: minmax(150px, 34%) 1fr; align-items: center; min-width: 560px; }
  .cal__months { display: grid; grid-template-columns: repeat(12, 1fr); position: relative; }
  .mh { text-align: center; color: var(--ink-2); font-weight: 700; padding: .25rem 0; border-left: 1px solid var(--line); line-height: 1.1; }
  .mh small { display: block; font-weight: 400; color: var(--ink-3); font-size: .68rem; }
  .mh.yr { border-left-color: var(--ink-3); }
  .cal__label { padding: .3rem .6rem .3rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cal__label small { display: block; color: var(--ink-3); font-size: .7rem; }
  .cal__row--pressure { margin: .25rem 0 .4rem; }
  .cal__row--pressure .cal__label { white-space: normal; }
  .heat {
    height: 30px; display: grid; place-items: center; font-weight: 700; color: #fff; font-size: .72rem;
    background: color-mix(in srgb, var(--iom-orange) calc(var(--a) * 100%), #f3f5f8); border-left: 1px solid #fff;
  }
  .cal__group { font-weight: 700; color: var(--ink); margin: .65rem 0 .15rem; padding-left: .5rem; border-left: 4px solid var(--c); font-size: .78rem; text-transform: uppercase; letter-spacing: .04em; min-width: 560px; }
  .cal__group span { color: var(--ink-3); font-weight: 400; }
  .track { height: 22px; background: repeating-linear-gradient(90deg, transparent 0, transparent calc(100% / 12 - 1px), var(--line) calc(100% / 12 - 1px), var(--line) calc(100% / 12)); border-radius: 2px; }
  .bar { position: absolute; top: 4px; bottom: 4px; border-radius: 3px; opacity: .92; }
  .today { position: absolute; top: -3px; bottom: -3px; width: 2px; background: var(--iom-blue); }
  .cal__today-note { font-size: .75rem; color: var(--ink-3); margin: .6rem 0 0; display: flex; align-items: center; gap: .4rem; }
  .today-key { display: inline-block; width: 2px; height: 12px; background: var(--iom-blue); }
  .cal__reading { margin-top: .9rem; padding: .75rem .9rem; background: var(--iom-tint-1); border-radius: 4px; font-size: .88rem; }
  .sources { padding-left: 1.1rem; }
  .sources a { word-break: break-all; }
</style>
