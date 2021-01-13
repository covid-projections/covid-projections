import { concat, partition, sortBy, find, values, isNull } from 'lodash';
import regions from './region_db';
import { getStateFips } from './regions_data';
import { County, State, Region, MetroArea } from './types';
import { GeolocationInfo } from 'common/hooks/useGeolocation';

const UNITED_STATES = 'United States';

export function belongsToState(county: County, stateFips: string | null) {
  return county.state.fipsCode === stateFips;
}

const sortByPopulation = (regions: Region[]): Region[] =>
  sortBy(regions, region => -region.population);

/**
 * Returns a list of regions in the order that is most relevant given the
 * region passed as argument
 *
 * Homepage (region is undefined): states, metros, counties
 * Metro: counties in metro, states, other counties, metros
 * State and County: counties in the state, states, metros, other counties
 */
export function getAutocompleteRegions(region?: Region): Region[] {
  const { states, metroAreas, counties } = regions;

  // Homepage
  if (!region) {
    return concat<Region>(states, metroAreas, counties);
  }

  // Location pages
  if (region instanceof MetroArea) {
    const [countiesInMetro, otherCounties] = partition(counties, county =>
      region.counties.includes(county),
    );
    const sortedMetroCounties = sortByPopulation(countiesInMetro);

    return concat<Region>(
      sortedMetroCounties,
      states,
      metroAreas,
      otherCounties,
    );
  } else if (region instanceof State || region instanceof County) {
    const stateFips = getStateFips(region);
    const [stateCounties, otherCounties] = partition(counties, county =>
      belongsToState(county, stateFips),
    );
    const sortedStateCounties = sortByPopulation(stateCounties);

    return concat<Region>(
      sortedStateCounties,
      states,
      metroAreas,
      otherCounties,
    );
  } else {
    return [];
  }
}

function countyIncludesZip(county: County, zipCode: string): boolean {
  return county.zipCodes.includes(zipCode);
}

export function getStateRegionFromStateCode(
  stateCode: string,
): Region | undefined {
  const regionFromStateCode = find(
    regions.states,
    (region: State) => region.stateCode === stateCode,
  );
  return regionFromStateCode;
}

export function getCountyRegionFromZipCode(
  zipCode: string,
): Region | undefined {
  const countyFromZip = find(regions.counties, (region: County) =>
    countyIncludesZip(region, zipCode),
  );
  return countyFromZip;
}

export function getMetroRegionFromZipCode(zipCode: string): Region | undefined {
  const countyFromZip = getCountyRegionFromZipCode(zipCode);
  const metroFromZip = find(regions.metroAreas, (region: MetroArea) =>
    region.counties.includes(countyFromZip as County),
  );
  return metroFromZip;
}

interface GeolocatedRegions {
  county?: Region;
  metroArea?: Region;
  state?: Region;
}

export function getGeolocatedRegions(
  geolocation: GeolocationInfo,
): GeolocatedRegions | null {
  if (geolocation.country !== UNITED_STATES) {
    return null;
  } else {
    return {
      county: getCountyRegionFromZipCode(geolocation.zipCode),
      metroArea: getMetroRegionFromZipCode(geolocation.zipCode),
      state: getStateRegionFromStateCode(geolocation.stateCode),
    };
  }
}

/**
 * We rank a user's geolocated regions (state, county, metro if applicable) first
 * in the searchbar dropdown menu. This sorts the Region[] accordingly.
 */
export function getAutocompleteRegionsWithGeolocation(
  geolocation: GeolocationInfo,
  locations: Region[],
): Region[] {
  const geolocatedRegions = getGeolocatedRegions(geolocation);
  if (isNull(geolocatedRegions)) {
    return locations;
  }
  const sanitizedGeolocatedRegionsArr = values(geolocatedRegions).filter(
    (region: Region | undefined) => region instanceof Region,
  ); // filters out undefined
  const [usersRegions, otherRegions] = partition(
    locations,
    (location: Region) => sanitizedGeolocatedRegionsArr.includes(location),
  );
  const sortedLocations = [...usersRegions, ...otherRegions];
  return sortedLocations;
}

/**
 * Checks if we've geolocated the user.
 * If so, returns autocomplete results with user's regions at the top.
 * If not, returns autocomplete results sorted for pagetype.
 */
export function getFinalAutocompleteLocations(
  geolocation: GeolocationInfo | undefined,
): Region[] {
  const regionsSortedForPagetype = getAutocompleteRegions();
  if (geolocation) {
    return getAutocompleteRegionsWithGeolocation(
      geolocation,
      regionsSortedForPagetype,
    );
  } else {
    return regionsSortedForPagetype;
  }
}
