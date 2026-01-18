export enum Regions {
  ame = "Africa & Middle East",
  anz = "Australia & New Zealand",
  bra = "Brazil",
  can = "Canada",
  chn = "China",
  eue = "Eastern Europe",
  eur = "Europe (EU)",
  fsu = "Former Soviet Union",
  ind = "India",
  men = "Middle East & North Africa",
  nam = "North America",
  oam = "Other Central America",
  oas = "Other Asia",
  osa = "Other South America",
  sas = "South Asia",
  sea = "Southeast Asia",
  ssa = "Sub-Saharan Africa",
  usa = "United States",
  wld = "World",
}

export enum Measures {
  area = "Land Area used",
  cons = "Consumption of commodity",
  expo = "Export of commodity",
  feed = "Livestock Feed",
  food = "Human Food",
  impo = "Import of commodity",
  land = "Land used",
  nett = "Net trade",
  othu = "Other use of land",
  prod = "Crop or livestock production",
  yild = "Crop yield",
}

export enum Units {
  "t"= "Tonne",
  "ha"= "Hectare",
  "t/ha" = "Tonnes/Hectare"
}
export enum LandUsage {
  cgr = "Coarse Grains",
  grs = "Grassland",
  osd = "Oilseeds",
  pfb = "Pulses, Fruits, & Berries",
  ric = "Rice",
  sgc = "Sugar cane",
  vfn = "Vegetables, fruits and nuts",
  wht = "Wheat",
  nrm = "Non-ruminant animals",
  rum = "Ruminant animals",
  crp = "Cropland",
  for = "Forest",
  nld = "Natural Land",
  dry = "Dry matter",
}

export enum Visuals {
  bar = "Bar Chart",
  timeseries = "Time Series Chart",
}

export const FlyToRegions: Record<string, { center: [number, number], zoom: number }> = {
  ame: { center: [3500000, 1500000], zoom: 3 },
  anz: { center: [15000000, -3500000], zoom: 3 },
  bra: { center: [-6000000, -1500000], zoom: 3 },
  can: { center: [-11500000, 8500000], zoom: 3 },
  chn: { center: [11500000, 4500000], zoom: 3 },
  eue: { center: [3500000, 6500000], zoom: 3 },
  eur: { center: [1500000, 6500000], zoom: 3 },
  fsu: { center: [10000000, 8500000], zoom: 3 },
  ind: { center: [8800000, 2500000], zoom: 3 },
  men: { center: [3000000, 3500000], zoom: 3 },
  nam: { center: [-11500000, 6500000], zoom: 3 },
  oam: { center: [-9500000, 1500000], zoom: 3 },
  oas: { center: [14000000, 2500000], zoom: 3 },
  osa: { center: [-7500000, -3500000], zoom: 3 },
  sas: { center: [8500000, 2500000], zoom: 3 },
  sea: { center: [13000000, 500000], zoom: 3 },
  ssa: { center: [2500000, -500000], zoom: 3 },
  usa: { center: [-11000000, 5000000], zoom: 3 },
  wld: { center: [0, 0], zoom: 3 },
};
