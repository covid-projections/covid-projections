import surgoPopulationVulnerable from './surgo-percent-population-vulnerable.json';
/**
 * CCVI has 8 scores per fips (1 'overall' score, 7 nuanced scores)
 *
 * See the defintion of each nuanced score, themes 1-7, here (page 6):
 * https://surgoventures.org/resource-library/report-vulnerable-communities-and-covid-19
 */
export interface RegionCcviItem {
  [overall: string]: number;
  theme1: number;
  theme2: number;
  theme3: number;
  theme4: number;
  theme5: number;
  theme6: number;
  theme7: number;
}

/** Represent entries in ccvi.json. */
export interface FipsToCcviMap {
  [fipsCode: string]: RegionCcviItem;
}

/** Represents entries in county-zipcode.json */
export interface CountyToZipMap {
  [fips: string]: string[];
}

/** Represent entries in surgo-percent-population-vulnerable.json. */
export interface FipsToPopVulnerable {
  [fipsCode: string]: number;
}

/** Cache used by importJson(). */
let cachedImports: { [cacheToken: string]: Promise<any> } = {};

/**
 * Helper for importing JSON dynamically that handles caching the import() promise and
 * extracting the default export where the JSON lives.
 *
 * Usage: importJson('foo', import('./foo.json'))
 *
 * @param cacheToken An arbitrary token used to cache the promise. Must be unique.
 * @param importPromise The promise returned from a import('foo/bar.json') call.
 */
function importJson<T>(
  cacheToken: string,
  importPromise: Promise<{ default: T }>,
): Promise<T> {
  cachedImports[cacheToken] =
    cachedImports[cacheToken] || importPromise.then(module => module.default);
  return cachedImports[cacheToken];
}

/** Dynamic import for ccvi.json. */
export function importFipsToCcviMap(): Promise<FipsToCcviMap> {
  return importJson('ccvi', import('./ccvi.json'));
}

/** Dynamic import for county-zipcode.json. */
export function importCountyToZipCodeMap(): Promise<CountyToZipMap> {
  return importJson('county-zipcode', import('./county-zipcode.json'));
}

export function getVulnPopulationPercentForFips(
  fips: string,
): number | undefined {
  const fipsToSurgoPopVulnerable: FipsToPopVulnerable = surgoPopulationVulnerable;
  return fipsToSurgoPopVulnerable[fips];
}

export type StatesTopology = typeof import('./states-10m.json');
export function importStateGeographies(): Promise<StatesTopology> {
  return importJson('states-10m', import('./states-10m.json'));
}

export type CountiesTopology = typeof import('./counties-10m.json');
export function importCountyGeographies(): Promise<CountiesTopology> {
  return importJson('counties-10m', import('./counties-10m.json'));
}

/** Represent entries in county_adjacency_msa.json. */
export interface CountyAdjacencyMap {
  counties: {
    [fips: string]: {
      adjacent_counties: string[];
      msa_code?: string;
    };
  };
}
export function importCountyAdjacency(): Promise<CountyAdjacencyMap> {
  return importJson(
    'county_adjacency_msa',
    import('./county_adjacency_msa.json'),
  ) as Promise<CountyAdjacencyMap>;
}
