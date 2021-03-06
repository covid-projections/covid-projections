import keyBy from 'lodash/keyBy';
import values from 'lodash/values';
import mapValues from 'lodash/mapValues';

import countiesByFipsJson from 'common/data/counties_by_fips.json';
import metroAreasByFipsJson from 'common/data/metro_areas_by_fips.json';

import {
  statesByFips,
  County,
  CountyObject,
  MetroArea,
  MetroAreaObject,
} from './types';

export const countiesByFips = mapValues(
  countiesByFipsJson as { [fips: string]: CountyObject },
  v => {
    return County.fromJSON(v);
  },
);

export const metroAreasByFips = mapValues(
  metroAreasByFipsJson as { [fips: string]: MetroAreaObject },
  v => {
    return MetroArea.fromJSON(v);
  },
);

// re-export so others can import from the same place?
export { statesByFips };

export const statesByStateCode = keyBy(
  values(statesByFips),
  state => state.stateCode,
);
