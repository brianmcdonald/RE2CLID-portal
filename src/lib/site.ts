/**
 * Helpers shared by the layouts and components (URLs, lookups, calendar maths).
 * You normally don't need to edit this file:
 *   - the list of clusters / countries / districts is in src/data/places.ts
 *   - page text is in the page files under src/pages/
 *   - seasonal calendars are in src/data/calendars.json
 */
import calendars from '../data/calendars.json';
import { CLUSTERS, COUNTRIES, DISTRICTS, type Cluster, type Country, type District } from '../data/places';

export { CLUSTERS, COUNTRIES, DISTRICTS };
export type { Cluster, Country, District };

export const BASE = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : import.meta.env.BASE_URL + '/';
/** Prefix an internal path with the deployment base path. */
export const url = (p = '') => BASE + p.replace(/^\//, '');

export const clusterBySlug = (s: string) => CLUSTERS.find((c) => c.slug === s)!;
export const countryBySlug = (s: string) => COUNTRIES.find((c) => c.slug === s)!;
export const countriesIn = (cluster: string) => COUNTRIES.filter((c) => c.cluster === cluster);
export const districtsIn = (country: string) => DISTRICTS.filter((d) => d.country === country);
export const districtBySlug = (country: string, slug: string) => {
  const d = DISTRICTS.find((x) => x.country === country && x.slug === slug);
  if (!d) throw new Error(`No district "${slug}" for country "${country}" in src/data/places.ts`);
  return d;
};

export const clusterUrl = (c: Cluster | string) => url(`${typeof c === 'string' ? c : c.slug}/`);
export const countryUrl = (c: Country) => url(`${c.cluster}/${c.slug}/`);
export const districtUrl = (d: District) => {
  const c = countryBySlug(d.country);
  return url(`${c.cluster}/${c.slug}/${d.slug}/`);
};
/** Reserved locations for the Quarto CVA outputs (see README). */
export const cvaUrl = (...parts: string[]) => url(`cva/${parts.join('/')}/`);

// ---------- Calendars ----------
export type CalEvent = { section: string; label: string; span: string; bars: number[][] };
export type Calendar = {
  title: string; name?: string; prose: string[]; indicative: string | null; sources_note: string | null;
  units: { name: string; pcode: string; detail: string }[]; events: CalEvent[];
  footnotes: Record<string, { text: string; url: string | null }>;
};
type CountryCal = { national: Calendar | null; areas: Record<string, Calendar>; note: string | null };

export const CAL_META = (calendars as any).meta as { generated: string; window: string[]; source: string };
const CALS = (calendars as any).countries as Record<string, CountryCal>;

export const countryCalendar = (c: Country): CountryCal | undefined => CALS[c.calendarKey];

/** Calendar used for a district page: the admin-1 action-area calendar, or a filtered national one. */
export function districtCalendar(d: District): Calendar | null {
  const c = countryBySlug(d.country);
  const cc = CALS[c.calendarKey];
  if (!cc) return null;
  if (d.adm1Pcode && cc.areas[d.adm1Pcode]) return cc.areas[d.adm1Pcode];
  if (cc.national && d.country === 'drc') {
    // National DRC records are admin-1 specific: keep those for Sud-Kivu.
    const events = cc.national.events.filter((e) => e.label.includes('Sud-Kivu'));
    return { ...cc.national, title: `${d.name} (Sud-Kivu records) – seasonal calendar`, events, prose: [], indicative: null };
  }
  return cc.national;
}

/** Strip [^ref] markers from calendar prose. */
export const stripRefs = (s: string) => s.replace(/\[\^[^\]]+\]/g, '');

/** Months (0–11) with hazard, lean-season or outbreak pressure. */
export function pressureMonths(cal: Calendar | null): number[] {
  const m = new Array(12).fill(0);
  if (!cal) return m;
  for (const e of cal.events) {
    if (!['Seasonal hazard', 'Lean season', 'Outbreak'].includes(e.section)) continue;
    const seen = new Set<number>();
    for (const [a, b] of e.bars) for (let i = a; i <= b; i++) seen.add(i);
    seen.forEach((i) => (m[i] += 1));
  }
  return m;
}

/** Distinct hazard / outbreak names in a calendar, for profile summaries. */
export function keyHazards(cal: Calendar | null): string[] {
  if (!cal) return [];
  const names = cal.events
    .filter((e) => e.section === 'Seasonal hazard' || e.section === 'Outbreak')
    .map((e) => e.label.replace(/\s*\(.*?\)\s*/g, '').trim());
  return [...new Set(names)];
}

export const EHSA_PAGE = 'https://ehsa.iom.int/regional-responses-climate-displacement-sub-saharan-africa-re2clid';

