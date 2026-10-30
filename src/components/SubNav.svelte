<script>
  /**
   * Sub-header navigation (white bar under the IOM blue header).
   * Desktop: inline links with cluster dropdowns. Mobile: collapsible menu.
   */
  let { items = [], active = 'programme', home = '/' } = $props();
  let open = $state(false);
  let openKey = $state(null);

  function toggle(key) { openKey = openKey === key ? null : key; }
  function onKey(e) { if (e.key === 'Escape') { openKey = null; open = false; } }
</script>

<svelte:window onkeydown={onKey} onclick={(e) => { if (!e.target.closest?.('.subnav')) openKey = null; }} />

<nav class="subnav" aria-label="Programme navigation">
  <div class="wrap-wide subnav__inner">
    <button class="subnav__toggle" aria-expanded={open} aria-controls="subnav-list" onclick={() => (open = !open)}>
      <span class="burger" aria-hidden="true"></span> Menu
    </button>

    <ul id="subnav-list" class="subnav__list" class:open>
      <li><a href={home} class:active={active === 'programme'}>Programme</a></li>
      {#each items as item}
        <li class="has-menu" class:expanded={openKey === item.key}>
          <div class="split">
            <a href={item.href} class:active={active === item.key}>{item.label}</a>
            <button class="caret" aria-label={`Show ${item.label} countries`} aria-expanded={openKey === item.key} onclick={() => toggle(item.key)}>
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2"/></svg>
            </button>
          </div>
          <div class="dropdown" role="group" aria-label={item.title}>
            <p class="dropdown__title"><a href={item.href}>{item.title}</a></p>
            <ul>
              {#each item.children as child}<li><a href={child.href}>{child.label}</a></li>{/each}
            </ul>
          </div>
        </li>
      {/each}
    </ul>

  </div>
</nav>

<style>
  .subnav { background: #fff; border-bottom: 1px solid var(--line); box-shadow: 0 2px 6px rgb(0 0 0 / 4%); }
  .subnav__inner { display: flex; align-items: center; justify-content: space-between; gap: 1rem; min-height: 50px; }
  .subnav__list { list-style: none; display: flex; gap: .25rem; margin: 0; padding: 0; align-items: center; }
  .subnav__list > li { position: relative; }
  .subnav__list a {
    display: block; padding: .8rem .7rem; font-weight: 700; font-size: .86rem; text-transform: uppercase; letter-spacing: .02em;
    text-decoration: none; color: var(--iom-blue); border-bottom: 3px solid transparent;
  }
  .subnav__list a:hover, .subnav__list a.active { border-bottom-color: var(--iom-yellow); }
  .split { display: flex; align-items: center; }
  .split a { padding-right: .25rem; }
  .caret { background: none; border: 0; color: var(--iom-blue); padding: .5rem .35rem; cursor: pointer; border-radius: 4px; }
  .caret:hover { background: var(--iom-tint-1); }
  .expanded .caret svg { transform: rotate(180deg); }
  .dropdown {
    display: none; position: absolute; top: 100%; left: 0; min-width: 260px; background: #fff; border: 1px solid var(--line);
    border-top: 3px solid var(--iom-blue); box-shadow: var(--shadow); padding: .75rem 0; z-index: 60;
  }
  .has-menu:hover .dropdown, .has-menu:focus-within .dropdown, .has-menu.expanded .dropdown { display: block; }
  .dropdown__title { margin: 0 1rem .25rem; font-size: .75rem; }
  .dropdown__title a { padding: 0; font-size: .75rem; color: var(--ink-3); border: 0; }
  .dropdown ul { list-style: none; margin: 0; padding: 0; }
  .dropdown ul a { text-transform: none; font-weight: 600; font-size: .92rem; padding: .45rem 1rem; border: 0; }
  .dropdown ul a:hover { background: var(--iom-tint-1); }
  .subnav__toggle { display: none; }

  @media (max-width: 860px) {
    .subnav__inner { flex-wrap: wrap; }
    .subnav__toggle {
      display: inline-flex; align-items: center; gap: .5rem; background: none; border: 0; font: inherit; font-weight: 700;
      color: var(--iom-blue); padding: .75rem 0; cursor: pointer; text-transform: uppercase; font-size: .86rem;
    }
    .burger, .burger::before, .burger::after { display: block; width: 18px; height: 2px; background: currentColor; position: relative; }
    .burger::before, .burger::after { content: ''; position: absolute; }
    .burger::before { top: -6px; } .burger::after { top: 6px; }
    .subnav__list { display: none; flex-direction: column; align-items: stretch; width: 100%; padding-bottom: .75rem; }
    .subnav__list.open { display: flex; }
    .subnav__list a { border-bottom: 0; border-left: 3px solid transparent; }
    .subnav__list a.active { border-left-color: var(--iom-yellow); }
    .split { justify-content: space-between; }
    .dropdown { position: static; box-shadow: none; border: 0; border-left: 3px solid var(--iom-tint-2); margin-left: .7rem; padding: .25rem 0; }
    .has-menu:hover .dropdown, .has-menu:focus-within .dropdown { display: none; }
    .has-menu.expanded .dropdown { display: block; }
  }
</style>
