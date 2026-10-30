<script>
  /** Explains the four nested levels of the CVA and lets the reader jump to examples. */
  let { levels = [] } = $props();
  let sel = $state(0);
</script>

<div class="levels">
  <div class="levels__steps" role="tablist" aria-label="Analysis levels">
    {#each levels as l, i}
      <button role="tab" aria-selected={sel === i} class:on={sel === i} onclick={() => (sel = i)} style={`--i:${i}`}>
        <span class="n">{l.count}</span>
        <span class="t">{l.label}</span>
      </button>
    {/each}
  </div>
  {#if levels[sel]}
    {@const l = levels[sel]}
    <div class="levels__panel" role="tabpanel">
      <h3>{l.label}-level analysis</h3>
      <p>{l.text}</p>
      {#if l.links?.length}
        <p class="links">
          {#each l.links as k}<a href={k.href}>{k.label}</a>{/each}
        </p>
      {/if}
    </div>
  {/if}
</div>

<style>
  .levels { background: #fff; border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; }
  .levels__steps { display: grid; grid-template-columns: repeat(4, 1fr); }
  button {
    font: inherit; border: 0; cursor: pointer; padding: 1rem .5rem; text-align: center; color: var(--iom-blue);
    background: color-mix(in srgb, var(--iom-blue) calc(6% + var(--i) * 6%), #fff); border-bottom: 4px solid transparent;
    display: flex; flex-direction: column; align-items: center; gap: .15rem;
  }
  button.on { background: var(--iom-blue); color: #fff; border-bottom-color: var(--iom-yellow); }
  .n { font-size: 1.6rem; font-weight: 700; line-height: 1; }
  .t { font-size: .78rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
  .levels__panel { padding: 1.25rem 1.4rem; }
  .links { display: flex; flex-wrap: wrap; gap: .4rem .9rem; margin: 0; font-size: .9rem; font-weight: 600; }
  @media (max-width: 520px) { .n { font-size: 1.25rem; } .t { font-size: .66rem; } }
</style>
