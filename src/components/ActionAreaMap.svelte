<script>
  /**
   * Interactive action-area map (Leaflet). Loads simplified GeoJSON exported from
   * RE2CLID_actions.gpkg (public/data/geo/*.geojson) and filters it client-side.
   *
   * Props:
   *   geoBase   base URL of the geo folder
   *   countries ISO2 codes to show (empty = all)
   *   district  admin-2 pcode to focus (shows its admin-3/4 units)
   *   links     { [adm2_pcode]: url } — clicking an admin-2 area navigates there
   *   height    CSS height
   */
  import { onMount } from 'svelte';
  let { geoBase = '/data/geo/', countries = [], district = null, links = {}, height = '420px', label = 'Map of RE2CLID action areas' } = $props();

  let el;
  let status = $state('loading');

  const STYLE = {
    adm1: { color: '#ff671f', weight: 2, fillOpacity: 0.04, fillColor: '#ff671f', dashArray: '4 3' },
    adm2: { color: '#b07800', weight: 1.2, fillColor: '#ffb81c', fillOpacity: 0.45 },
    adm2focus: { color: '#0033a0', weight: 2.5, fillColor: '#ffb81c', fillOpacity: 0.35 },
    adm3: { color: '#276d68', weight: 1, fillColor: '#5cb8b2', fillOpacity: 0.55 },
    adm4: { color: '#8f1820', weight: 1, fillColor: '#d22630', fillOpacity: 0.7 },
  };

  onMount(async () => {
    try {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      const get = (n) => fetch(`${geoBase}${n}.geojson`).then((r) => r.json());
      const [a1, a2, a3, a4] = await Promise.all(['adm1', 'adm2', 'adm3', 'adm4'].map(get));
      const inCountry = (f) => !countries.length || countries.includes(f.properties.adm0_pcode);
      const inDistrict = (f) => !district || f.properties.adm2_pcode === district;

      const map = L.map(el, { scrollWheelZoom: false, attributionControl: true });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO | Boundaries: OCHA COD-AB/EM, NBS Tanzania',
        subdomains: 'abcd', maxZoom: 18,
      }).addTo(map);

      const tip = (p, lvl) => {
        const name = p[`${lvl}_name`];
        const parts = [`<strong>${name}</strong>`, `<span>${p.adm1_name ?? ''}${lvl !== 'adm1' ? ', ' + (p.adm0_name ?? '') : ' · ' + (p.adm0_name ?? '')}</span>`];
        if (p.priority) parts.push(`<em>Priority: ${p.priority}</em>`);
        if (lvl === 'adm2' && links[p.adm2_pcode] && !district) parts.push('<small>Click to open district page</small>');
        return parts.join('<br>');
      };

      const groups = [];
      const a1f = a1.features.filter(inCountry).filter((f) => !district || f.properties.adm1_pcode === a2.features.find((g) => g.properties.adm2_pcode === district)?.properties.adm1_pcode);
      groups.push(L.geoJSON({ type: 'FeatureCollection', features: a1f }, { style: STYLE.adm1, interactive: false }));

      const a2f = a2.features.filter(inCountry);
      const a2layer = L.geoJSON({ type: 'FeatureCollection', features: district ? a2f.filter(inDistrict) : a2f }, {
        style: () => (district ? STYLE.adm2focus : STYLE.adm2),
        onEachFeature: (f, layer) => {
          layer.bindTooltip(tip(f.properties, 'adm2'), { sticky: true });
          const href = links[f.properties.adm2_pcode];
          if (href && !district) {
            layer.on('click', () => (window.location.href = href));
            layer.on('mouseover', () => layer.setStyle({ fillOpacity: 0.75 }));
            layer.on('mouseout', () => layer.setStyle({ fillOpacity: STYLE.adm2.fillOpacity }));
          }
        },
      });
      groups.push(a2layer);

      if (district) {
        const a3f = a3.features.filter(inDistrict);
        const a4f = a4.features.filter(inDistrict);
        if (a3f.length) groups.push(L.geoJSON({ type: 'FeatureCollection', features: a3f }, { style: STYLE.adm3, onEachFeature: (f, l) => l.bindTooltip(tip(f.properties, 'adm3'), { sticky: true }) }));
        if (a4f.length) groups.push(L.geoJSON({ type: 'FeatureCollection', features: a4f }, { style: STYLE.adm4, onEachFeature: (f, l) => l.bindTooltip(tip(f.properties, 'adm4'), { sticky: true }) }));
      }

      const fg = L.featureGroup(groups).addTo(map);
      if (fg.getBounds().isValid()) map.fitBounds(fg.getBounds(), { padding: [20, 20], maxZoom: district ? 11 : 9 });
      else map.setView([-8, 32], 4);
      status = 'ready';
    } catch (e) {
      console.error(e);
      status = 'error';
    }
  });
</script>

<div class="map-wrap">
  <div class="map" bind:this={el} style={`height:${height}`} role="region" aria-label={label}></div>
  {#if status === 'loading'}<div class="map__msg">Loading map…</div>{/if}
  {#if status === 'error'}<div class="map__msg">The interactive map could not be loaded.</div>{/if}
  <ul class="map__legend" aria-label="Map legend">
    <li><span class="k k1"></span>Action area (admin-1)</li>
    <li><span class="k k2"></span>{district ? 'This district' : 'District (admin-2)'}</li>
    {#if district}<li><span class="k k3"></span>Admin-3 action unit</li><li><span class="k k4"></span>Admin-4 / colline</li>{/if}
  </ul>
</div>

<style>
  .map-wrap { position: relative; background: #fff; border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; }
  .map { width: 100%; background: #eef2f6; }
  .map__msg { position: absolute; inset: 0 0 40px; display: grid; place-items: center; color: var(--ink-2); font-size: .9rem; pointer-events: none; }
  .map__legend { list-style: none; display: flex; flex-wrap: wrap; gap: .4rem 1.1rem; margin: 0; padding: .6rem 1rem; font-size: .78rem; color: var(--ink-2); border-top: 1px solid var(--line); }
  .map__legend li { display: inline-flex; align-items: center; gap: .4rem; }
  .k { width: 14px; height: 10px; display: inline-block; border-radius: 2px; }
  .k1 { border: 2px dashed #ff671f; }
  .k2 { background: rgb(255 184 28 / 60%); border: 1px solid #b07800; }
  .k3 { background: rgb(92 184 178 / 70%); border: 1px solid #276d68; }
  .k4 { background: rgb(210 38 48 / 75%); }
  :global(.leaflet-tooltip) { font-family: var(--font); font-size: .8rem; line-height: 1.35; }
  :global(.leaflet-tooltip small) { color: #0033a0; }
</style>
