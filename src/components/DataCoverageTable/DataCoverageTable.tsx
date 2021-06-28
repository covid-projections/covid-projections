import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import CheckIcon from '@material-ui/icons/Check';
import {
  StyledTableHead,
  MetricTableCell,
  AvailabilityTableCell,
  MetricTableRow,
  MetricTableCellHeader,
} from './DataCoverageTable.style';
import coverageSummary from 'components/DataCoverageTable/coverage-summary.json';
import { fail, formatPercent, pluralize } from 'common/utils';
import { RegionType } from 'common/regions';
import { TextTooltip } from 'components/InfoTooltip';

export const COVERAGE_SUMMARY = coverageSummary as MetricCoverage[];

interface MetricField {
  displayName: string;
  field: string;
}

export const FIELDS: MetricField[] = [
  { displayName: 'Overall risk level', field: 'riskLevels.overall' },
  { displayName: 'Daily new cases', field: 'metrics.caseDensity' },
  { displayName: 'Infection rate', field: 'metrics.infectionRate' },
  { displayName: 'Positive test rate', field: 'metrics.testPositivityRatio' },
  { displayName: '% Vaccinated', field: 'metrics.vaccinationsInitiatedRatio' },
  {
    displayName: 'Vaccine demographics',
    field: 'actuals.vaccinationsInitiatedDemographics',
  },
  { displayName: 'ICU capacity used', field: 'metrics.icuCapacityRatio' },
  { displayName: 'Hospitalization usage', field: 'metrics.icuCapacityRatio' },
  { displayName: 'Deaths', field: 'actuals.deaths' },
  { displayName: 'Total testing volume', field: 'actuals.positiveTests' },
];

export const FIELDS_PRETTY_NAMES = FIELDS.map(field => {
  const record = COVERAGE_SUMMARY.find(record => field.field === record.name);
  if (record) {
    return {
      ...record,
      name: field.displayName,
    };
  }

  return null;
}).filter((record): record is MetricCoverage => record !== null);

export interface CoverageDetails {
  totalRegions: number;
  regionsAvailable: number;
  totalStates: number;
  statesAvailable: number;
}

export interface MetricCoverage {
  name: string;
  state: CoverageDetails;
  county: CoverageDetails;
  metro: CoverageDetails;
}

const TextWithTooltip: React.FC<{ text: string; tooltipContent: string }> = ({
  text,
  tooltipContent,
}) => {
  return (
    <TextTooltip
      title={tooltipContent}
      mainCopy={text}
      trackOpenTooltip={() => {}}
    />
  );
};

const tooltipText = (coverage: CoverageDetails, regionType: RegionType) => {
  switch (regionType) {
    case RegionType.COUNTY:
      return (
        `Supported in ${coverage.regionsAvailable} counties (of ${coverage.totalRegions}), ` +
        `or ${coverage.statesAvailable} states and territories (of ${coverage.totalStates}).`
      );
    case RegionType.MSA:
      return `Supported in ${coverage.regionsAvailable} metros (of ${coverage.totalRegions}).`;
    case RegionType.STATE:
      return `Supported in ${coverage.regionsAvailable} states (of ${coverage.totalRegions}).`;
    case RegionType.NATION:
      fail('Unexpected RegionType.NATION');
  }
};

const Status: React.FC<{ status: CoverageDetails; level: RegionType }> = ({
  status,
  level,
}) => {
  if (status.regionsAvailable === 0) {
    return (
      <TextWithTooltip text="No data" tooltipContent="No data available." />
    );
  }

  const availableRatio = status.regionsAvailable / status.totalRegions;

  if (availableRatio >= 0.95) {
    return <CheckIcon color="secondary" titleAccess="Complete coverage" />;
  }

  const tooltipContent = tooltipText(status, level);
  if (availableRatio >= 0.6 || level === RegionType.MSA) {
    return (
      <TextWithTooltip
        text={`~${formatPercent(availableRatio, 0)}`}
        tooltipContent={tooltipContent}
      />
    );
  }

  const statesText = pluralize(status.statesAvailable, 'State', 'States');
  return (
    <TextWithTooltip
      text={`${status.statesAvailable} ${statesText}`}
      tooltipContent={tooltipContent}
    />
  );
};

const CoverageRow: React.FC<{ row: MetricCoverage }> = ({ row }) => {
  return (
    <MetricTableRow>
      <MetricTableCell>{row.name}</MetricTableCell>
      <AvailabilityTableCell>
        <Status status={row.state} level={RegionType.STATE} />
      </AvailabilityTableCell>
      <AvailabilityTableCell>
        <Status status={row.county} level={RegionType.COUNTY} />
      </AvailabilityTableCell>
      <AvailabilityTableCell>
        <Status status={row.metro} level={RegionType.MSA} />
      </AvailabilityTableCell>
    </MetricTableRow>
  );
};

const CoverageTable: React.FC<{ rows: MetricCoverage[] }> = ({ rows }) => {
  return (
    <TableContainer>
      <Table aria-label="Data Coverage Table">
        <StyledTableHead>
          <TableRow>
            <MetricTableCellHeader>Metric</MetricTableCellHeader>
            <AvailabilityTableCell>States</AvailabilityTableCell>
            <AvailabilityTableCell>Counties</AvailabilityTableCell>
            <AvailabilityTableCell>Metros</AvailabilityTableCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {rows.map(row => (
            <CoverageRow key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CoverageTable;
