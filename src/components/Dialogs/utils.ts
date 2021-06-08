import { Sources } from 'api/schema/RegionSummaryWithTimeseries';
import { Metric } from 'common/metricEnum';
import { metricToTooltipMap } from 'cms-content/tooltips';
import { Region } from 'common/regions';
import { getDataSourceTooltipContent } from 'common/utils/provenance';

export interface MetricModalContent {
  howItsCalculated: string;
  dataSource?: React.ReactElement;
  metricDefinition: string;
}

export function getMetricModalContent(
  region: Region,
  metric: Metric,
  provenance?: Sources,
): MetricModalContent {
  const howItsCalculated = metricToTooltipMap[metric].metricCalculation.body;

  const dataSource = getDataSourceTooltipContent(metric, region, provenance);

  const metricDefinition = metricToTooltipMap[metric].metricDefinition.body;

  const modalContent = {
    howItsCalculated,
    dataSource,
    metricDefinition,
  };

  return modalContent;
}