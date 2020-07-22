import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ScreenshotWrapper,
  ChartWrapper,
  Content,
  Headers,
  LogoHolder,
  Location,
  MetricName,
  LastUpdated,
  Url,
} from './ChartExportImage.style';
import LogoUrlLight from 'assets/images/logoUrlLight';
import { Projections } from 'common/models/Projections';
import { MetricChart } from '../../../components/Charts';
import { ALL_METRICS, getMetricNameExtended } from 'common/metric';
import { Metric } from 'common/metric';
import { findCountyByFips } from 'common/locations';
import { useProjections, useModelLastUpdatedDate } from 'common/utils/model';
import { Projection } from 'common/models/Projection';
import { formatUtcDate } from 'common/utils';

const ExportChartImage = () => {
  let { stateId, countyFipsId, metric: metricString } = useParams();
  const lastUpdated = useModelLastUpdatedDate();

  let projections: Projections | undefined;
  const [countyOption] = useState(
    countyFipsId && findCountyByFips(countyFipsId),
  );
  stateId = stateId || countyOption.state_code;
  projections = useProjections(stateId, countyOption) as any;
  if (!projections || !lastUpdated) {
    return null;
  }
  const projection = projections.primary as Projection;

  const metric = parseInt(metricString) as Metric;
  if (isNaN(metric) || !ALL_METRICS.includes(metric)) {
    return <h1>Unknown metric: {metricString}!</h1>;
  }

  const chartHeight = 415;

  let url = `https://covidactnow.org/us/${stateId}`;
  if (countyOption) {
    url += `/county/${countyOption.county_url_name}`;
  }

  return (
    <ScreenshotWrapper className={'screenshot'}>
      <Content>
        <Headers>
          <Location>{projection.locationName}</Location>
          <MetricName>{getMetricNameExtended(metric)}</MetricName>
          <LastUpdated>Last updated {formatUtcDate(lastUpdated)} </LastUpdated>
        </Headers>
        <LogoHolder>
          Generated by
          <br />
          <LogoUrlLight height={15} />
        </LogoHolder>
        <ChartWrapper>
          <MetricChart
            metric={metric}
            projections={projections}
            height={
              metric === Metric.FUTURE_PROJECTIONS
                ? chartHeight - 55
                : chartHeight
            }
          />
        </ChartWrapper>
        <Url>{url}</Url>
      </Content>
    </ScreenshotWrapper>
  );
};

export default ExportChartImage;
