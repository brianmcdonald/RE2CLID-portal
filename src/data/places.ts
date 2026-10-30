/**
 * THE LIST OF PLACES on the site: clusters, countries and districts.
 * Edit names, partners and descriptions here. To add a district: add an entry to
 * DISTRICTS below, then create its page file (copy an existing district folder in
 * src/pages/<cluster>/<country>/ and change the two attributes on <DistrictPage>).
 * Text for each page lives in the page files under src/pages/.
 */

export type ClusterSlug = 'cluster-1' | 'cluster-2';

export interface Cluster {
  slug: ClusterSlug;   // used in the URL
  number: 1 | 2;
  name: string;
  short: string;       // short name for menus and breadcrumbs
  map: string;         // file name (without extension) of the reference map in public/maps/
  partners: string;
}

export interface Country {
  slug: string;        // used in the URL
  name: string;
  short: string;
  iso2: string;        // matches adm0_pcode in the map GeoJSON
  cluster: ClusterSlug;
  map: string;         // reference map in public/maps/
  calendarKey: string; // country name used in src/data/calendars.json
  partners: string;
  blurb: string;       // one or two sentences shown on the cluster page
}

export interface Unit {
  name: string;
  pcode?: string;
  priority?: string;   // e.g. 'first priority', 'secondary'
  remarks?: string;
  children?: string[]; // admin-4 units (Burundi collines)
}

export interface District {
  slug: string;        // used in the URL; must match the page folder name
  name: string;
  pcode: string;       // admin-2 P-code; '' if not yet known
  adminLevel: 1 | 2;
  adm1: string;
  adm1Pcode?: string;  // links the district to its action-area seasonal calendar
  country: string;     // country slug
  priority?: string;
  units: Unit[];       // sub-district action units (admin-3)
  source: 'gpkg' | 'tip'; // 'gpkg' = in the action-area GeoPackage; 'tip' = named in a TIP, to confirm
  sourceNote?: string;
  hasGeometry: boolean; // true if the district has a boundary in public/data/geo/
}

export const CLUSTERS: Cluster[] = [
  {
    slug: 'cluster-1', number: 1, name: 'Lake Tanganyika Basin', short: 'Lake Tanganyika',
    map: 're2clid_cluster_1',
    partners: 'IOM with consortium partner Enabel (Belgian development agency) leading Specific Objective 2.',
  },
  {
    slug: 'cluster-2', number: 2, name: 'Southern Africa & South-West Indian Ocean', short: 'Southern Africa & SWIO',
    map: 're2clid_cluster_2',
    partners: 'IOM, with the World Food Programme (WFP) as partner in Mozambique.',
  },
];

export const COUNTRIES: Country[] = [
  {
    slug: "burundi", name: "Burundi", short: "Burundi", iso2: "BI", cluster: "cluster-1",
    map: "re2clid_burundi", calendarKey: "Burundi", partners: "IOM, Enabel",
    blurb: "Burundi remains one of the least developed countries (ranked 187 out of 191 countries on the Human Development Index in 2022) with a low-income economy.",
  },
  {
    slug: "drc", name: "Democratic Republic of the Congo", short: "DRC", iso2: "CD", cluster: "cluster-1",
    map: "re2clid_drc", calendarKey: "Democratic Republic of the Congo", partners: "IOM, Enabel",
    blurb: "The Democratic Republic of the Congo (DRC) faces intersecting crises, including protracted armed conflict, environmental degradation, extreme poverty, and climate change impacts, making it one of the most complex humanitarian contexts globally.",
  },
  {
    slug: "tanzania", name: "United Republic of Tanzania", short: "Tanzania", iso2: "TZ", cluster: "cluster-1",
    map: "re2clid_tanzania", calendarKey: "Tanzania", partners: "IOM, Enabel",
    blurb: "The Kigoma region, located on the northeastern shores of Lake Tanganyika, hosts a population of approximately 2.3 million and an additional 250,000 refugees from neighboring countries, the majority of whom live in the refugee camps of Nduta and Nyarugusu.",
  },
  {
    slug: "malawi", name: "Malawi", short: "Malawi", iso2: "MW", cluster: "cluster-2",
    map: "re2clid_malawi", calendarKey: "Malawi", partners: "IOM",
    blurb: "Malawi is exposed to a wide variety of natural hazards that include floods, strong winds, dry spells, cyclones, earthquakes, and landslides.",
  },
  {
    slug: "mozambique", name: "Mozambique", short: "Mozambique", iso2: "MZ", cluster: "cluster-2",
    map: "re2clid_mozambique", calendarKey: "Mozambique", partners: "IOM, WFP",
    blurb: "Mozambique is among the countries most exposed to tropical cyclones, floods and drought in the South-West Indian Ocean basin.",
  },
  {
    slug: "madagascar", name: "Madagascar", short: "Madagascar", iso2: "MG", cluster: "cluster-2",
    map: "re2clid_madagascar", calendarKey: "Madagascar", partners: "IOM",
    blurb: "Madagascar faces a series of complex, interlocking challenges resulting in a multifaceted humanitarian crisis.",
  },
  {
    slug: "comoros", name: "Comoros", short: "Comoros", iso2: "KM", cluster: "cluster-2",
    map: "re2clid_comoros", calendarKey: "Comoros", partners: "IOM",
    blurb: "The Union of the Comoros is highly vulnerable to a wide range of natural hazards, including cyclones, floods, volcanic eruptions, and epidemics, with over 54% of its population living in high-risk areas.",
  },
  {
    slug: "mauritius", name: "Mauritius", short: "Mauritius", iso2: "MU", cluster: "cluster-2",
    map: "re2clid_mauritius", calendarKey: "Mauritius", partners: "IOM",
    blurb: "Mauritius faces significant risks to its economy and social development due to climate change.",
  },
  {
    slug: "seychelles", name: "Seychelles", short: "Seychelles", iso2: "SC", cluster: "cluster-2",
    map: "re2clid_seychelles", calendarKey: "Seychelles", partners: "IOM",
    blurb: "Natural hazards are becoming more frequent and severe in Seychelles as climate change progresses.",
  },
];

export const DISTRICTS: District[] = [
  // ---- Burundi ----
  {
    slug: "bukinanyana", name: "Bukinanyana", pcode: "BI202", adminLevel: 2,
    adm1: "Bujumbura", adm1Pcode: "BI2", country: "burundi",
    source: 'gpkg', hasGeometry: true,
    units: [
      { name: "Buganda", pcode: "BI20201", children: ["Ruhagarika"] },
      { name: "Ndava", pcode: "BI20207", children: ["Ndava"] },
    ],
  },
  {
    slug: "mpanda", name: "Mpanda", pcode: "BI205", adminLevel: 2,
    adm1: "Bujumbura", adm1Pcode: "BI2", country: "burundi",
    source: 'gpkg', hasGeometry: true,
    units: [
      { name: "Rugazi", pcode: "BI20509", children: ["Kibuye"] },
    ],
  },
  {
    slug: "muhuta", name: "Muhuta", pcode: "BI208", adminLevel: 2,
    adm1: "Bujumbura", adm1Pcode: "BI2", country: "burundi",
    source: 'gpkg', hasGeometry: true,
    units: [
      { name: "Magara", pcode: "BI20804", children: ["Vuma"] },
    ],
  },
  {
    slug: "ntahangwa", name: "Ntahangwa", pcode: "BI210", adminLevel: 2,
    adm1: "Bujumbura", adm1Pcode: "BI2", country: "burundi",
    source: 'gpkg', hasGeometry: true,
    units: [
      { name: "Rubirizi", pcode: "BI21012", children: ["Nyabunyegeri"] },
    ],
  },
  {
    slug: "makamba", name: "Makamba", pcode: "BI302", adminLevel: 2,
    adm1: "Burunga", adm1Pcode: "BI3", country: "burundi",
    source: 'gpkg', hasGeometry: true,
    units: [
      { name: "Kayogoro", pcode: "BI30210", children: ["Quartier Swahili"] },
    ],
  },
  {
    slug: "nyanza", name: "Nyanza", pcode: "BI305", adminLevel: 2,
    adm1: "Burunga", adm1Pcode: "BI3", country: "burundi",
    source: 'gpkg', hasGeometry: true,
    units: [
      { name: "Mukungu", pcode: "BI30510", children: ["Mukungu"] },
      { name: "Nyanza", pcode: "BI30512", children: ["Mvugo"] },
    ],
  },
  {
    slug: "rumonge", name: "Rumonge", pcode: "BI306", adminLevel: 2,
    adm1: "Burunga", adm1Pcode: "BI3", country: "burundi",
    source: 'gpkg', hasGeometry: true,
    units: [
      { name: "Gatete", pcode: "BI30604", children: ["Mutambara"] },
      { name: "Rumonge", pcode: "BI30612", children: ["Quartier Kanyenkoko"] },
    ],
  },
  // ---- Madagascar ----
  {
    slug: "manakara-atsimo", name: "Manakara Atsimo", pcode: "MG27210", adminLevel: 2,
    adm1: "Fitovinany", adm1Pcode: "MG27", country: "madagascar",
    source: 'gpkg', hasGeometry: true,
    units: [],
  },
  {
    slug: "ikongo", name: "Ikongo", pcode: "MG27211", adminLevel: 2,
    adm1: "Fitovinany", adm1Pcode: "MG27", country: "madagascar",
    source: 'gpkg', hasGeometry: true,
    units: [],
  },
  {
    slug: "vohipeno", name: "Vohipeno", pcode: "MG27212", adminLevel: 2,
    adm1: "Fitovinany", adm1Pcode: "MG27", country: "madagascar",
    source: 'gpkg', hasGeometry: true,
    units: [],
  },
  {
    slug: "antsiranana-ii", name: "Antsiranana II", pcode: "MG71713", adminLevel: 2,
    adm1: "Diana", adm1Pcode: "MG71", country: "madagascar",
    source: 'gpkg', hasGeometry: true,
    units: [],
  },
  {
    slug: "antsiranana-i", name: "Antsiranana I", pcode: "MG71715", adminLevel: 2,
    adm1: "Diana", adm1Pcode: "MG71", country: "madagascar",
    source: 'gpkg', hasGeometry: true,
    units: [],
  },
  {
    slug: "ambilobe", name: "Ambilobe", pcode: "MG71717", adminLevel: 2,
    adm1: "Diana", adm1Pcode: "MG71", country: "madagascar",
    source: 'gpkg', hasGeometry: true,
    units: [],
  },
  {
    slug: "nosy-be", name: "Nosy-Be", pcode: "MG71718", adminLevel: 2,
    adm1: "Diana", adm1Pcode: "MG71", country: "madagascar",
    source: 'gpkg', hasGeometry: true,
    units: [],
  },
  {
    slug: "ambanja", name: "Ambanja", pcode: "MG71719", adminLevel: 2,
    adm1: "Diana", adm1Pcode: "MG71", country: "madagascar",
    source: 'gpkg', hasGeometry: true,
    units: [],
  },
  // ---- Malawi ----
  {
    slug: "dowa", name: "Dowa", pcode: "MW204", adminLevel: 2,
    adm1: "Central", adm1Pcode: "MW2", country: "malawi",
    source: 'gpkg', hasGeometry: true,
    units: [
      { name: "TA Mkukula", pcode: "MW20405" },
      { name: "TA Msakambewa", pcode: "MW20406" },
    ],
  },
  {
    slug: "mangochi", name: "Mangochi", pcode: "MW301", adminLevel: 2,
    adm1: "Southern", adm1Pcode: "MW3", country: "malawi",
    source: 'gpkg', hasGeometry: true,
    units: [
      { name: "TA Chimwala", pcode: "MW30102" },
      { name: "TA Nankumba", pcode: "MW30104" },
      { name: "TA Chowe", pcode: "MW30107" },
      { name: "TA Makanjila", pcode: "MW30109" },
    ],
  },
  {
    slug: "blantyre", name: "Blantyre", pcode: "MW305", adminLevel: 2,
    adm1: "Southern", adm1Pcode: "MW3", country: "malawi",
    source: 'gpkg', hasGeometry: true,
    units: [
      { name: "TA Lundu", pcode: "MW30502", remarks: "District supplied as \"Blantyre District\"" },
      { name: "TA Chigaru", pcode: "MW30503", remarks: "District supplied as \"Blantyre District\"" },
    ],
  },
  {
    slug: "mulanje", name: "Mulanje", pcode: "MW308", adminLevel: 2,
    adm1: "Southern", adm1Pcode: "MW3", country: "malawi",
    source: 'gpkg', hasGeometry: true,
    units: [
      { name: "TA Mabuka", pcode: "MW30801" },
      { name: "TA Laston Njema", pcode: "MW30802" },
      { name: "TA Nkanda", pcode: "MW30805" },
    ],
  },
  {
    slug: "phalombe", name: "Phalombe", pcode: "MW309", adminLevel: 2,
    adm1: "Southern", adm1Pcode: "MW3", country: "malawi",
    source: 'gpkg', hasGeometry: true,
    units: [
      { name: "TA Jenala", pcode: "MW30905" },
    ],
  },
  {
    slug: "chikwawa", name: "Chikwawa", pcode: "MW310", adminLevel: 2,
    adm1: "Southern", adm1Pcode: "MW3", country: "malawi",
    source: 'gpkg', hasGeometry: true,
    units: [
      { name: "TA Ngabu", pcode: "MW31001" },
      { name: "TA Lundu", pcode: "MW31002" },
      { name: "TA Maseya", pcode: "MW31004" },
      { name: "TA Makhwira", pcode: "MW31007" },
      { name: "TA Ngowe", pcode: "MW31011" },
    ],
  },
  {
    slug: "nsanje", name: "Nsanje", pcode: "MW311", adminLevel: 2,
    adm1: "Southern", adm1Pcode: "MW3", country: "malawi",
    source: 'gpkg', hasGeometry: true,
    units: [
      { name: "TA Mlolo", pcode: "MW31104" },
      { name: "TA Mbenje", pcode: "MW31107" },
    ],
  },
  {
    slug: "blantyre-city", name: "Blantyre City", pcode: "MW315", adminLevel: 2,
    adm1: "Southern", adm1Pcode: "MW3", country: "malawi",
    source: 'gpkg', hasGeometry: true,
    units: [
      { name: "Bangwe Ward", pcode: "MW31545", remarks: "Separate Bangwe Mthandizi Ward (MW31546) exists - not included, to confirm" },
      { name: "Soche East Ward", pcode: "MW31547", remarks: "Blantyre City has wards, not TAs; \"Sochi\" matches Soche East and Soche West wards - both included, to confirm" },
      { name: "Soche West Ward", pcode: "MW31550", remarks: "Blantyre City has wards, not TAs; \"Sochi\" matches Soche East and Soche West wards - both included, to confirm" },
    ],
  },
  // ---- Mozambique ----
  {
    slug: "mutarara", name: "Mutarara", pcode: "MZ0511", adminLevel: 2,
    adm1: "Tete", adm1Pcode: "MZ05", country: "mozambique",
    source: 'gpkg', hasGeometry: true,
    units: [],
  },
  {
    slug: "doa", name: "Doa", pcode: "MZ0514", adminLevel: 2,
    adm1: "Tete", adm1Pcode: "MZ05", country: "mozambique",
    source: 'gpkg', hasGeometry: true,
    units: [],
  },
  {
    slug: "caia", name: "Caia", pcode: "MZ0703", adminLevel: 2,
    adm1: "Sofala", adm1Pcode: "MZ07", country: "mozambique",
    source: 'gpkg', hasGeometry: true,
    units: [],
  },
  {
    slug: "marromeu", name: "Marromeu", pcode: "MZ0711", adminLevel: 2,
    adm1: "Sofala", adm1Pcode: "MZ07", country: "mozambique",
    source: 'gpkg', hasGeometry: true,
    units: [],
  },
  {
    slug: "nhamatanda", name: "Nhamatanda", pcode: "MZ0713", adminLevel: 2,
    adm1: "Sofala", adm1Pcode: "MZ07", country: "mozambique",
    source: 'gpkg', hasGeometry: true,
    units: [],
  },
  // ---- United Republic of Tanzania ----
  {
    slug: "kigoma-district-council", name: "Kigoma District Council", pcode: "TZ160311", adminLevel: 2,
    adm1: "Kigoma", adm1Pcode: "TZ16", country: "tanzania", priority: "first priority",
    source: 'gpkg', hasGeometry: true,
    units: [
      { name: "Kagunga", pcode: "TZ160311011", priority: "first priority", remarks: "COD-AB 2018: TZ1603011" },
      { name: "Mkigo", pcode: "TZ160311021", priority: "first priority", remarks: "COD-AB 2018: TZ1603021 (79 km2; Nyarubanda ward since split off, now 35 km2)" },
      { name: "Mwamgongo", pcode: "TZ160311031", priority: "secondary", remarks: "COD-AB 2018: TZ1603031" },
      { name: "Mwandiga", pcode: "TZ160311113", priority: "secondary", remarks: "COD-AB 2018: TZ1603113" },
      { name: "Simbo", pcode: "TZ160311151", priority: "secondary", remarks: "COD-AB 2018 places Simbo in Uvinza (TZ1605071); NBS 2022 and the IOM report in Kigoma DC" },
    ],
  },
  {
    slug: "kigoma-ujiji-municipal-council", name: "Kigoma Ujiji Municipal Council", pcode: "TZ160323", adminLevel: 2,
    adm1: "Kigoma", adm1Pcode: "TZ16", country: "tanzania", priority: "first priority",
    source: 'gpkg', hasGeometry: true,
    units: [
      { name: "Kibirizi", pcode: "TZ160323022", priority: "first priority", remarks: "COD-AB 2018: TZ1604022" },
      { name: "Kagera", pcode: "TZ160323062", priority: "secondary", remarks: "COD-AB 2018: TZ1604062" },
      { name: "Kitongoni", pcode: "TZ160323112", priority: "secondary", remarks: "COD-AB 2018: TZ1604112" },
      { name: "Katubuka", pcode: "TZ160323192", priority: "first priority", remarks: "COD-AB 2018: TZ1604192" },
    ],
  },
  {
    slug: "uvinza-district-council", name: "Uvinza District Council", pcode: "TZ160411", adminLevel: 2,
    adm1: "Kigoma", adm1Pcode: "TZ16", country: "tanzania", priority: "first priority",
    source: 'gpkg', hasGeometry: true,
    units: [
      { name: "Igalula", pcode: "TZ160411031", priority: "secondary", remarks: "COD-AB 2018: TZ1605031" },
      { name: "Ilagala", pcode: "TZ160411061", priority: "first priority", remarks: "COD-AB 2018: TZ1605061 (571 km2; Mwakizega ward since split off, now 420 km2)" },
      { name: "Nguruka", pcode: "TZ160411133", priority: "secondary", remarks: "COD-AB 2018: TZ1605133" },
      { name: "Itebula", pcode: "TZ160411141", priority: "secondary", remarks: "COD-AB 2018: TZ1605141" },
      { name: "Herembe", pcode: "TZ160411151", priority: "first priority", remarks: "Not in COD-AB 2018: split from Sigunga ward (TZ1605041)" },
    ],
  },
  // ---- Areas named in the TIPs, not yet in the GeoPackage (to confirm) ----
  { slug: "uvira", name: "Uvira", pcode: '', adminLevel: 2, adm1: "Sud-Kivu", country: "drc", source: 'tip', hasGeometry: false, units: [],
    sourceNote: "Named in the DRC TIP (Uvira municipality / territory, South Kivu). Not yet in the action-area GeoPackage; boundaries and sub-units to be confirmed during inception." },
  { slug: "moroni-bambao", name: "Moroni-Bambao", pcode: '', adminLevel: 2, adm1: "Ngazidja (Grande Comore)", country: "comoros", source: 'tip', hasGeometry: false, units: [],
    sourceNote: "Named as a district of concern in the Comoros TIP. Not yet in the action-area GeoPackage." },
  { slug: "hambou", name: "Hambou", pcode: '', adminLevel: 2, adm1: "Ngazidja (Grande Comore)", country: "comoros", source: 'tip', hasGeometry: false, units: [],
    sourceNote: "Named as a district of concern in the Comoros TIP. Not yet in the action-area GeoPackage." },
  { slug: "mitsamiouli-mboude", name: "Mitsamiouli-Mboudé", pcode: '', adminLevel: 2, adm1: "Ngazidja (Grande Comore)", country: "comoros", source: 'tip', hasGeometry: false, units: [],
    sourceNote: "Named as a district of concern in the Comoros TIP. Not yet in the action-area GeoPackage." },
  { slug: "sima", name: "Sima", pcode: '', adminLevel: 2, adm1: "Ndzuwani (Anjouan)", country: "comoros", source: 'tip', hasGeometry: false, units: [],
    sourceNote: "Named as a district of concern in the Comoros TIP. Not yet in the action-area GeoPackage." },
  { slug: "rodrigues", name: "Rodrigues", pcode: '', adminLevel: 1, adm1: "Rodrigues", country: "mauritius", source: 'tip', hasGeometry: false, units: [],
    sourceNote: "The Mauritius TIP covers mainland Mauritius and Rodrigues Island; specific sites are to be agreed with national authorities. Shown at admin-1 level (outer island)." },
];
