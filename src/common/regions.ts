import { createContext, useContext } from 'react';
import { chain, fromPairs } from 'lodash';
import urlJoin from 'url-join';
import { assert } from 'common/utils';
import US_STATE_DATASET from 'components/MapSelectors/datasets/us_states_dataset_01_02_2020.json';
import countyAdjacencyMsa from './data/county_adjacency_msa.json';
const { state_dataset, state_county_map_dataset } = US_STATE_DATASET;

export type FipsCode = string;

export enum RegionType {
  COUNTY = 'county',
  STATE = 'state',
  CBSA = 'CBSA',
}

export abstract class Region {
  constructor(
    public readonly name: string,
    public readonly urlSegment: string,
    public readonly fipsCode: FipsCode,
    public readonly population: number,
    public readonly regionType: RegionType,
  ) {}

  abstract fullName(): string;
  abstract relativeUrl(): string;
  canonicalUrl() {
    return urlJoin('https://covidactnow.org', this.relativeUrl());
  }
}

export class State extends Region {
  constructor(
    name: string,
    urlSegment: string,
    fipsCode: FipsCode,
    population: number,
    public readonly stateCode: string,
  ) {
    super(name, urlSegment, fipsCode, population, RegionType.STATE);
  }

  /**
   * State: Washington
   * County: King County, Washington
   */
  fullName() {
    return this.name;
  }

  relativeUrl() {
    return `us/${this.urlSegment}`;
  }
}

export class County extends Region {
  constructor(
    name: string,
    urlSegment: string,
    fipsCode: FipsCode,
    population: number,
    public readonly state: State,
    public readonly cityNames: string[],
    private readonly adjacentCountiesFips: FipsCode[],
  ) {
    super(name, urlSegment, fipsCode, population, RegionType.COUNTY);
  }

  fullName() {
    return `${this.name}, ${this.state.name}`;
  }

  relativeUrl() {
    return urlJoin(this.state.relativeUrl(), `county/${this.urlSegment}`);
  }
}

const states: State[] = chain(state_dataset)
  .map(stateInfo => {
    return new State(
      stateInfo.state,
      stateInfo.state_url_name,
      stateInfo.state_fips_code,
      stateInfo.population,
      stateInfo.state_code,
    );
  })
  .value();

const statesByFips = fromPairs(states.map(state => [state.fipsCode, state]));
const statesFipsList = states.map(state => state.fipsCode);

interface AdjacencyInfo {
  adjacent_counties: FipsCode[];
  msa_code?: string;
}

const adjacency: { [fipsCode: string]: AdjacencyInfo } =
  countyAdjacencyMsa.counties;

const counties: County[] = chain(state_county_map_dataset)
  .map(stateData => stateData.county_dataset)
  .flatten()
  .filter(county => statesFipsList.includes(county.state_fips_code))
  .map(countyInfo => {
    const countyFips = countyInfo.full_fips_code;
    const state = statesByFips[countyInfo.state_fips_code];
    const adjacentCounties = adjacency[countyFips]?.adjacent_counties;
    return new County(
      countyInfo.county,
      countyInfo.county_url_name,
      countyInfo.full_fips_code,
      countyInfo.population,
      state,
      countyInfo.cities || [],
      adjacentCounties || [],
    );
  })
  .value();

class RegionDB {
  private regions: Region[];

  constructor(public states: State[], public counties: County[]) {
    this.regions = [...states, ...counties];
  }

  findByFipsCode(fipsCode: FipsCode): Region | null {
    const region = this.regions.find(region => region.fipsCode === fipsCode);
    return region || null;
  }

  findStateByUrlParams(stateUrlSegment: string): State | null {
    // The second condition is added to support legacy URLs with the 2-letter
    // state code (`/us/wa`)
    const foundState = this.states.find(
      state =>
        equalLower(state.urlSegment, stateUrlSegment) ||
        equalLower(state.stateCode, stateUrlSegment),
    );
    return foundState || null;
  }

  findCountyByUrlParams(
    stateUrlSegment: string,
    countyUrlSegment: string,
  ): County | null {
    const foundState = this.findStateByUrlParams(stateUrlSegment);
    if (!foundState) {
      return null;
    }

    const foundCounty = this.counties.find(
      county =>
        county.state.fipsCode === foundState.fipsCode &&
        equalLower(county.urlSegment, countyUrlSegment),
    );

    return foundCounty || null;
  }

  all(): Region[] {
    return this.regions;
  }
}

function equalLower(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase();
}

const regions = new RegionDB(states, counties);
export default regions;

// We are careful to never call `useRegion()` in components that are not
// nested inside `<RegionContext.Provider>` so we cheat and pretend that the
// value is non-nullable
export const RegionContext = createContext<Region>(null as any);

export const useLocationPageRegion = () => {
  const region = useContext(RegionContext);
  assert(
    region,
    '`useLocationPageRegion` can only be called from components inside LocationPage',
  );
  return region;
};
