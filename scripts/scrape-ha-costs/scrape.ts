/**
 * Run via: yarn scrape-ha-costs
 */

import fetch from 'node-fetch';
import delay from 'delay';
import fs from 'fs';
import path from 'path';
import uniq from 'lodash/uniq';
import countyZipcodes from '../../src/common/data/county-zipcode.json';
import regions, { belongsToState, County } from '../../src/common/regions';
import { assert } from '../../src/common/utils';

// Refers to the HomeAdvisor input data that we're collecting costs for.  E.g.
// if you visit https://www.homeadvisor.com/cost/heating-and-cooling/install-a-furnace/ and
// enter your zipcode in the "Furnace Replacement Cost Calculator", the network request you see
// in the Chrome network tab is:
// https://www.homeadvisor.com/sm/cost/widget/updateGeo?zipCode=94107&costGuideId=88&...
// so the cost guide ID is '88'
// Some known IDs:
// https://www.homeadvisor.com/cost/heating-and-cooling/install-a-heat-pump/ => 116
// https://www.homeadvisor.com/cost/heating-and-cooling/install-a-furnace/ => 88
// https://www.homeadvisor.com/cost/plumbing/install-a-water-heater/ => 263
const COST_GUIDE_ID = '263';

// false = just states; true = include metros
const SCRAPE_METROS = true;

const LOGGING_ENABLED = false;
const logger = LOGGING_ENABLED ? console.log : (...arg: any[]) => {};

const SCRAPE_COLUMNS = [
  'avgCost',
  'avgRangeMinCost',
  'avgRangeMaxCost',
  'minCost',
  'maxCost',
  'numCostProfiles',
];

async function main() {
  await scrapeStates();

  if (SCRAPE_METROS) {
    await scrapeMetros();
  }
}

async function scrapeStates() {
  const result = {};
  for (const state of regions.states) {
    const counties = regions.counties.filter(c =>
      belongsToState(c, state.fipsCode),
    );

    await scrapeCountyZips(state.name, counties, (zip, costData) => {
      const regionCostData = costData?.['regionCostData'];
      if (regionCostData) {
        // Make sure it's the right state, since zipcodes cross state boundaries.
        let stateName = regionCostData['geoName'];
        if (stateName === 'Washington DC') {
          stateName = 'District of Columbia';
        }
        if (stateName !== state.name) {
          logger(`Skipping zip ${zip} which returned wrong state ${stateName}`);
          return false; // keep scraping
        }
        // Store state data.
        (result as any)[state.fipsCode] = {
          fipsCode: state.fipsCode,
          stateCode: state.stateCode,
          stateName: state.fullName,
          ...regionCostData,
        };
        return true; // stop scraping this set of counties.
      }
    });
  }

  renderCsv('state-costs.csv', result, [
    'fipsCode',
    'stateCode',
    'stateName',
    ...SCRAPE_COLUMNS,
  ]);
}

async function scrapeMetros() {
  const result = {};
  for (const metro of regions.metroAreas) {
    const counties = metro.countiesFips.map(
      fips => regions.findByFipsCodeStrict(fips) as County,
    );

    await scrapeCountyZips(metro.fullName, counties, (zip, costData) => {
      const localCostData = costData?.['localCostData'];
      if (localCostData) {
        // Make sure it's the right metro, since zipcodes cross county boundaries.
        let fips = `${localCostData.geoId}`;
        if (fips !== metro.fipsCode) {
          const wrongRegion = regions.findByFipsCode(fips);
          logger(
            `Skipping zip ${zip} which returned wrong region (${wrongRegion?.fullName}) instead of ${metro.fullName}`,
          );
          return false; // keep scraping
        }
        // Store state data.
        (result as any)[metro.fipsCode] = {
          fipsCode: metro.fipsCode,
          metroName: metro.fullName,
          ...localCostData,
        };
        return true; // stop scraping this set of counties.
      } else {
        logger(`No data for ${zip}`);
      }
    });
  }

  renderCsv('metro-costs.csv', result, [
    'fipsCode',
    'metroName',
    ...SCRAPE_COLUMNS,
  ]);
}

async function renderCsv(name: string, data: any, columns: string[]) {
  // Output CSV.
  const lines = [];
  lines.push(columns.join(','));
  for (const entry of Object.values(data)) {
    lines.push(
      columns
        .map(column => (entry as any)[column])
        .map(v => (typeof v === 'string' && v.includes(' ') ? `"${v}"` : v))
        .join(','),
    );
  }

  const file = path.join(__dirname, name);
  fs.writeFileSync(file, lines.join('\n'));
  console.log(`Wrote ${lines.length - 1} results to`, file);
}

async function scrapeCountyZips(
  groupName: string,
  counties: County[],
  cb: (zip: string, costData: any) => boolean | undefined,
) {
  const zipcodes = uniq(
    counties.map(c => (countyZipcodes as any)[c.fipsCode] || []).flat(),
  ) as string[];

  // Check up to 5 zipcodes
  for (const zip of pickEvenly(zipcodes, 7)) {
    const url = `https://www.homeadvisor.com/sm/cost/widget/updateGeo?zipCode=${zip}&costGuideId=${COST_GUIDE_ID}`;
    const res = await fetchWithRetry(url);
    const json = await res.json();
    const costData = json['costGuideWidgetDataHolder'];
    if (cb(zip, costData)) {
      return;
    }
  }

  logger(`Failed to get data for ${groupName}`);
}

async function fetchWithRetry(url: string) {
  for (let i = 0; i < 3; i++) {
    try {
      return await fetch(url);
    } catch (e) {
      console.warn('Fetch failed', e);
      await delay(1000);
    }
  }
  throw new Error('Failed to fetch ' + url);
}

function pickEvenly<T>(array: T[], n: number): T[] {
  const result = [] as T[];
  const skip = Math.floor(array.length / n) || 1;
  for (let i = 0; i < array.length && result.length < n; i += skip) {
    result.push(array[i]);
  }
  assert(result.length === n || n > array.length);
  return result;
}

if (require.main === module) {
  main().catch(err => {
    console.error(err);
    process.exit(-1);
  });
}
