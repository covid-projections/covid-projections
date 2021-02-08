import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useHistory } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import * as QueryString from 'query-string';
import { assert, fail } from 'common/utils';
import {
  fetchAllStateProjections,
  fetchAllCountyProjections,
  fetchProjectionsRegion,
} from 'common/utils/model';
import { Wrapper, ModelSelectorContainer } from './CompareSnapshots.style';
import { Metric, getMetricName, ALL_METRICS } from 'common/metric';
import { Projections } from 'common/models/Projections';
import { ProjectionsSet } from 'common/models/ProjectionsSet';
import { SortType, ProjectionsPair } from 'common/models/ProjectionsPair';
import { SNAPSHOT_URL, SnapshotVersion, Api } from 'api';
import moment from 'moment';
import { fetchSummaries } from 'common/location_summaries';
import {
  snapshotFromUrl,
  fetchMainSnapshotNumber,
  snapshotUrl,
} from 'common/utils/snapshots';
import regions, { County, MetroArea, Region } from 'common/regions';
import {
  DISABLED_METRICS,
  reenableDisabledMetrics,
} from 'common/models/Projection';
import { ComparisonList } from './ComparisonList';

// TODO(michael): Compare page improvements:
// * Virtualize the list so that it's not so awful slow. NOTE: I previously
//   used react-lazyload for this, but it was buggy (sometimes would show stale
//   charts after changing state properties)
// * Add a chart that overlays the two series on top of each other.
// * Show the diff value (the RMSD of the series or the delta between metric values).
// * Automatically find the latest snapshot (probably by just incrementing the
//   snapshot number until it 404s)

enum Locations {
  STATES_AND_INTERESTING_REGIONS,
  STATES,
  TOP_COUNTIES_BY_POPULATION,
  TOP_COUNTIES_BY_DIFF,
  TOP_METROS_BY_POPULATION,
}

const COUNTIES_LIMIT = 100;
const METROS_LIMIT = 100;

// For "interesting" regions, we take the 30 top diffs of the counties with
// > 500k population and the 20 top diffs of metro areas.
const INTERESTING_COUNTIES_POPULATION = 500000;
const INTERESTING_COUNTIES_TOP_DIFFS = 30;
const INTERESTING_METROS_TOP_DIFFS = 20;

export function CompareSnapshots() {
  // We want to force all metrics to be reenabled so we can evaluate whether they're fixed.
  useEffect(() => {
    reenableDisabledMetrics(true);
    return () => reenableDisabledMetrics(false);
  }, []);

  const mainSnapshot = useMainSnapshot();
  // TODO(michael): Is there a better React-y way to condition the bulk of a
  // component on a hook result (without introducing a separate component)?
  if (!mainSnapshot) {
    return null;
  } else {
    return <CompareSnapshotsInner mainSnapshot={mainSnapshot} />;
  }
}

function CompareSnapshotsInner({ mainSnapshot }: { mainSnapshot: number }) {
  const location = useLocation();
  const history = useHistory();

  const params = QueryString.parse(history.location.search);

  const [leftSnapshot, setLeftSnapshot] = useState(
    getParamValue(params, 'left', mainSnapshot),
  );
  const [rightSnapshot, setRightSnapshot] = useState(
    getParamValue(params, 'right', snapshotFromUrl(SNAPSHOT_URL)),
  );

  // We have separate state for the input field text
  // because we don't want to actually update our
  // URLs (and reload all the charts) until the
  // input field loses focus (onBlur).
  const [leftSnapshotText, setLeftSnapshotText] = useState(
    leftSnapshot.toString(),
  );
  const [rightSnapshotText, setRightSnapshotText] = useState(
    rightSnapshot.toString(),
  );

  const [sortType, setSortType] = useState<SortType>(
    getParamValue(params, 'sort', SortType.METRIC_DIFF),
  );
  const [metric, setMetric] = useState(
    getParamValue(params, 'metric', Metric.CASE_DENSITY),
  );
  const [locations, setLocations] = useState(
    getParamValue(
      params,
      'locations',
      Locations.STATES_AND_INTERESTING_REGIONS,
    ),
  );

  // Load models for all states or counties.
  let { projectionsSet, loadingText } = useProjectionsSet(
    leftSnapshot,
    rightSnapshot,
    locations,
    metric,
  );
  projectionsSet = projectionsSet.sortBy(sortType, metric);

  const leftVersion = useSnapshotVersion(leftSnapshot);
  const rightVersion = useSnapshotVersion(rightSnapshot);

  function setQueryParams(newParams: {
    left?: number;
    right?: number;
    sort?: number;
    metric?: number;
    locations?: number;
  }) {
    const params = {
      left: leftSnapshot,
      right: rightSnapshot,
      sort: sortType,
      metric: metric,
      locations: locations,
      ...newParams,
    };

    history.push({
      ...location,
      search: QueryString.stringify(params),
    });
  }

  const changeLeftSnapshot = () => {
    const left = parseInt(leftSnapshotText);
    if (!Number.isNaN(left)) {
      setLeftSnapshot(left);
      setQueryParams({ left });
    }
  };

  const changeRightSnapshot = () => {
    const right = parseInt(rightSnapshotText);
    if (!Number.isNaN(right)) {
      setRightSnapshot(right);
      setQueryParams({ right });
    }
  };

  // TODO: Figure out correct type for event.
  const changeSort = (event: any) => {
    const sort = parseInt(event.target.value);
    setSortType(sort);
    setQueryParams({ sort });
  };

  // TODO: Figure out correct type for event.
  const changeMetric = (event: any) => {
    const metric = parseInt(event.target.value);
    setMetric(metric);
    setQueryParams({ metric });
  };

  // TODO: Figure out correct type for event.
  const changeLocations = (event: any) => {
    const locations = parseInt(event.target.value);
    setLocations(locations);
    setQueryParams({ locations });
  };

  return (
    <Wrapper>
      <ModelSelectorContainer>
        <FormControl style={{ width: '8rem', marginRight: '1rem' }}>
          <TextField
            id="compare-left"
            label="Left Snapshot"
            value={leftSnapshotText}
            onChange={e => setLeftSnapshotText(e.target.value)}
            onBlur={() => changeLeftSnapshot()}
            onKeyPress={ev => {
              if (ev.key === 'Enter') {
                changeLeftSnapshot();
                ev.preventDefault();
              }
            }}
          />
        </FormControl>
        <FormControl style={{ width: '8rem' }}>
          <TextField
            id="compare-right"
            label="Right Snapshot"
            value={rightSnapshotText}
            onChange={e => setRightSnapshotText(e.target.value)}
            onBlur={() => changeRightSnapshot()}
            onKeyPress={ev => {
              if (ev.key === 'Enter') {
                changeRightSnapshot();
                ev.preventDefault();
              }
            }}
          />
        </FormControl>
        <FormControl style={{ width: '14rem', marginLeft: '1rem' }}>
          <InputLabel focused={false}>Show:</InputLabel>
          <Select value={locations} onChange={changeLocations}>
            <MenuItem value={Locations.STATES_AND_INTERESTING_REGIONS}>
              States & Interesting Regions
            </MenuItem>
            <MenuItem value={Locations.STATES}>States</MenuItem>
            <MenuItem value={Locations.TOP_COUNTIES_BY_POPULATION}>
              Top {COUNTIES_LIMIT} Counties (by Population)
            </MenuItem>
            <MenuItem value={Locations.TOP_COUNTIES_BY_DIFF}>
              Top {COUNTIES_LIMIT} Counties (by Diff)
            </MenuItem>
            <MenuItem value={Locations.TOP_METROS_BY_POPULATION}>
              Top {METROS_LIMIT} Metros (by Population)
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl style={{ width: '12rem', marginLeft: '1rem' }}>
          <InputLabel focused={false}>Metric:</InputLabel>
          <Select value={metric} onChange={changeMetric}>
            {ALL_METRICS.map(metric => (
              <MenuItem key={metric} value={metric}>
                {getMetricName(metric)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl style={{ width: '12rem', marginLeft: '1rem' }}>
          <InputLabel focused={false}>Sort by:</InputLabel>
          <Select value={sortType} onChange={changeSort}>
            <MenuItem value={SortType.SERIES_DIFF}>Series Diff (RMSD)</MenuItem>
            <MenuItem value={SortType.METRIC_DIFF}>Metric Diff</MenuItem>
            <MenuItem value={SortType.POPULATION}>Population</MenuItem>
            <MenuItem value={SortType.ALPHABETICAL}>Name</MenuItem>
          </Select>
        </FormControl>
      </ModelSelectorContainer>

      <Grid container spacing={8} style={{ margin: '1px' }}>
        <Grid item xs={6}>
          Left Snapshot: <b>{leftSnapshot}</b>
          <VersionInfo version={leftVersion} />
        </Grid>
        <Grid item xs={6}>
          Right Snapshot: <b>{rightSnapshot}</b>
          <VersionInfo version={rightVersion} />
        </Grid>
      </Grid>

      <ComparisonList
        metric={metric}
        projectionsSet={projectionsSet}
        loadingText={loadingText}
      />
    </Wrapper>
  );
}

const VersionInfo = function ({
  version,
}: {
  version: SnapshotVersion | null;
}) {
  return (
    version && (
      <div style={{ fontSize: 'small' }}>
        <b>Build finished:</b>{' '}
        {moment.utc(version.timestamp).local().toDate().toString()}
        <br />
        <b>covid-data-model:</b>{' '}
        {JSON.stringify(version['covid-data-model']).replace(',', ', ')}
        <br />
        <b>covid-data-public:</b>{' '}
        {JSON.stringify(version['covid-data-public']).replace(',', ', ')}
        <br />
      </div>
    )
  );
};

function useMainSnapshot(): number | null {
  const [snapshot, setSnapshot] = useState<number | null>(null);
  useEffect(() => {
    async function fetchData() {
      setSnapshot(await fetchMainSnapshotNumber());
    }
    fetchData();
  }, []);

  return snapshot;
}

function useProjectionsSet(
  leftSnapshot: number,
  rightSnapshot: number,
  locations: Locations,
  metric: Metric,
): {
  projectionsSet: ProjectionsSet;
  loadingText: string;
} {
  const [projectionsSet, setProjectionsSet] = useState<ProjectionsSet>(
    new ProjectionsSet([]),
  );
  const [loadingText, setLoadingText] = useState('Loading...');

  useEffect(() => {
    setLoadingText('Loading...');
    setProjectionsSet(new ProjectionsSet([]));

    async function fetchData() {
      if (locations === Locations.STATES) {
        setProjectionsSet(
          ProjectionsSet.fromProjections(
            await fetchAllStateProjections(snapshotUrl(leftSnapshot)),
            await fetchAllStateProjections(snapshotUrl(rightSnapshot)),
          ),
        );
      } else if (locations === Locations.TOP_COUNTIES_BY_POPULATION) {
        const topCounties = regions.topCountiesByPopulation(COUNTIES_LIMIT);
        setProjectionsSet(
          ProjectionsSet.fromProjections(
            await fetchRegionProjections(leftSnapshot, topCounties),
            await fetchRegionProjections(rightSnapshot, topCounties),
          ),
        );
      } else if (locations === Locations.TOP_METROS_BY_POPULATION) {
        const topMetros = regions.topMetrosByPopulation(METROS_LIMIT);
        setProjectionsSet(
          ProjectionsSet.fromProjections(
            await fetchRegionProjections(leftSnapshot, topMetros),
            await fetchRegionProjections(rightSnapshot, topMetros),
          ),
        );
      } else if (locations === Locations.TOP_COUNTIES_BY_DIFF) {
        const topCounties = await fetchTopCountiesByDiff(
          leftSnapshot,
          rightSnapshot,
          metric,
        );
        if (topCounties !== null) {
          setProjectionsSet(
            ProjectionsSet.fromProjections(
              await fetchRegionProjections(leftSnapshot, topCounties),
              await fetchRegionProjections(rightSnapshot, topCounties),
            ),
          );
        } else {
          // Couldn't load summary files. Just fetch all county projections and take the top diffs (slow).
          setLoadingText(
            'Loading (slow due to no pre-generated summary file in https://github.com/covid-projections/covid-projections/tree/develop/scripts/alert_emails/summaries)...',
          );
          setProjectionsSet(
            ProjectionsSet.fromProjections(
              await fetchAllCountyProjections(snapshotUrl(leftSnapshot)),
              await fetchAllCountyProjections(snapshotUrl(rightSnapshot)),
            ).top(COUNTIES_LIMIT, SortType.METRIC_DIFF, metric),
          );
        }
      } else if (locations === Locations.STATES_AND_INTERESTING_REGIONS) {
        const interestingRegions = await fetchInterestingRegions(
          leftSnapshot,
          rightSnapshot,
          metric,
        );
        if (interestingRegions === null) {
          // Couldn't load summary files. Just fetch all county projections and take the top diffs (slow).
          setLoadingText(
            `Can't load "States & Interesting Regions" since there's no pre-generated summary file in https://github.com/covid-projections/covid-projections/tree/develop/scripts/alert_emails/summaries...`,
          );
        } else {
          // Start with the states.
          let leftProjections = await fetchAllStateProjections(
            snapshotUrl(leftSnapshot),
          );
          let rightProjections = await fetchAllStateProjections(
            snapshotUrl(rightSnapshot),
          );

          leftProjections = leftProjections.concat(
            await fetchRegionProjections(leftSnapshot, interestingRegions),
          );
          rightProjections = rightProjections.concat(
            await fetchRegionProjections(rightSnapshot, interestingRegions),
          );
          setProjectionsSet(
            ProjectionsSet.fromProjections(leftProjections, rightProjections),
          );
        }
      } else {
        fail('Unknown locations selection.');
      }
    }

    fetchData();
  }, [leftSnapshot, rightSnapshot, locations, metric]);

  return { projectionsSet, loadingText };
}

async function fetchInterestingRegions(
  leftSnapshot: number,
  rightSnapshot: number,
  metric: Metric,
): Promise<Region[] | null> {
  const regionDiffs = await fetchSortedRegionDiffs(
    leftSnapshot,
    rightSnapshot,
    metric,
  );
  if (regionDiffs === null) {
    return null;
  }
  const interestingCounties = _.takeRight(
    regionDiffs
      .filter(rd => rd.region instanceof County)
      .filter(
        rd =>
          rd.region.population >= INTERESTING_COUNTIES_POPULATION ||
          rd.diff >= ProjectionsPair.LOWEST_SENTINEL_DIFF,
      ),
    INTERESTING_COUNTIES_TOP_DIFFS,
  );

  const interestingMetros = _.takeRight(
    regionDiffs.filter(rd => rd.region instanceof MetroArea),
    INTERESTING_METROS_TOP_DIFFS,
  );

  return [...interestingCounties, ...interestingMetros].map(rd => rd.region);
}

function fetchRegionProjections(
  snapshotNumber: number,
  regions: Region[],
): Promise<Projections[]> {
  return Promise.all(
    regions.map(region =>
      fetchProjectionsRegion(region, snapshotUrl(snapshotNumber)).catch(err => {
        console.error(err);
        return null;
      }),
    ),
  ).then(projections => projections.filter(p => p !== null) as Projections[]);
}

/**
 * Returns an array of { region, diff } pairs for all regions, indicating the
 * difference in the specified metric between the specified snapshots, ordered
 * by smallest diff to largest diff.
 */
async function fetchSortedRegionDiffs(
  leftSnapshot: number,
  rightSnapshot: number,
  metric: Metric,
): Promise<Array<{ region: Region; diff: number }> | null> {
  const leftSummaries = await fetchSummaries(leftSnapshot).catch(e => null);
  const rightSummaries = await fetchSummaries(rightSnapshot).catch(e => null);
  if (leftSummaries === null || rightSummaries === null) {
    return null;
  }

  return regions
    .all()
    .map(region => {
      const fips = region.fipsCode;
      const leftValue = leftSummaries[fips]?.metrics?.[metric]?.value ?? null;
      const rightValue = rightSummaries[fips]?.metrics?.[metric]?.value ?? null;
      const isDisabled = DISABLED_METRICS[metric].includes(fips);
      const diff = isDisabled
        ? ProjectionsPair.DISABLED_METRIC_DIFF
        : ProjectionsPair.metricValueDiff(leftValue, rightValue);
      return {
        region,
        diff,
      };
    })
    .sort((a, b) => a.diff - b.diff);
}

async function fetchTopCountiesByDiff(
  leftSnapshot: number,
  rightSnapshot: number,
  metric: Metric,
): Promise<Region[] | null> {
  const regionDiffs = await fetchSortedRegionDiffs(
    leftSnapshot,
    rightSnapshot,
    metric,
  );
  if (regionDiffs === null) {
    return null;
  }
  return _.takeRight(
    regionDiffs.filter(rd => rd.region instanceof County),
    COUNTIES_LIMIT,
  ).map(rd => rd.region);
}

function getParamValue(
  params: QueryString.ParsedQuery,
  param: string,
  defaultValue: number,
): number {
  let value = _.get(params, param, defaultValue);
  if (typeof value === 'string') {
    value = parseInt(value);
  }
  assert(
    typeof value === 'number' && !Number.isNaN(value),
    `Parameter ${param} has non-numeric value: ${value}`,
  );
  return value;
}

export function useSnapshotVersion(
  snapshot: number | null,
): SnapshotVersion | null {
  const [version, setVersion] = useState<SnapshotVersion | null>(null);
  useEffect(() => {
    setVersion(null);
    if (snapshot !== null) {
      new Api(snapshotUrl(snapshot)).fetchVersionInfo().then(version => {
        setVersion(version);
      });
    }
  }, [snapshot]);

  return version;
}

export default CompareSnapshots;
