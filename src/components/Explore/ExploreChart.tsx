import React, { useCallback, Fragment } from 'react';
import moment from 'moment';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { GridRows, GridColumns } from '@vx/grid';
import { Line } from '@vx/shape';
import { Group } from '@vx/group';
import { scaleTime, scaleLinear } from '@vx/scale';
import { useTooltip } from '@vx/tooltip';
import { Column } from 'common/models/Projection';
import * as ChartStyle from 'components/Charts/Charts.style';
import { RectClipGroup, TooltipOverlayX } from 'components/Charts';
import { Series } from './interfaces';
import SeriesChart, { SeriesMarker } from './SeriesChart';
import { getMaxBy, getTimeAxisTicks, weeksAgo } from './utils';
import * as Styles from './Explore.style';
import { COLOR_MAP } from 'common/colors';
import { ScreenshotReady } from 'components/Screenshot';
import { SingleLocationTooltip } from './ExploreTooltips';
import SeriesTooltipOverlayX from './SeriesTooltipOverlay';

const getDate = (d: Column) => new Date(d.x);
const getY = (d: Column) => d.y;
const daysBetween = (dateFrom: Date, dateTo: Date) =>
  moment(dateTo).diff(dateFrom, 'days');

const DateMarker: React.FC<{ left: number; date: Date }> = ({ left, date }) => {
  // Do not show the date marker for dates in the future
  return new Date() < date ? null : (
    <Styles.DateMarker style={{ left }}>
      {weeksAgo(date, new Date())}
    </Styles.DateMarker>
  );
};

/**
 * This component renders the highlighted data on mouse over. Note that we don't
 * actually highlight existing elements in the SVG, we render the markers on top
 * of them, which is more performant and flexible, as just highlighting is not
 * always enough.
 */
const DataHoverMarkers: React.FC<{
  series: Series[];
  date: Date;
  x: (d: Column) => number;
  y: (d: Column) => number;
  yMax: number;
  barWidth: number;
  barOpacityHover?: number;
}> = ({ series, x, y, date, yMax, barWidth, barOpacityHover }) => (
  <Fragment>
    {series.map(({ label, type, data }) => (
      <SeriesMarker
        key={`series-marker-${label}`}
        type={type}
        data={data}
        x={x}
        y={y}
        date={date}
        yMax={yMax}
        barWidth={barWidth}
        barOpacityHover={barOpacityHover}
      />
    ))}
  </Fragment>
);

const ExploreChart: React.FC<{
  width: number;
  height: number;
  series: Series[];
  isMobile: boolean;
  tooltipSubtext?: string;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  barOpacity?: number;
  barOpacityHover?: number;
  showLabels?: boolean;
}> = ({
  width,
  height,
  series,
  isMobile,
  tooltipSubtext = '',
  marginTop = 10,
  marginBottom = 30,
  marginLeft = 60,
  marginRight = 10,
  barOpacity,
  barOpacityHover,
  showLabels = false,
}) => {
  const dateFrom = new Date('2020-03-01');
  const today = new Date();
  const dateTo = moment(today).add(5, 'days').toDate();
  const numDays = daysBetween(dateFrom, dateTo);
  const maxY = getMaxBy<number>(series, getY, 1);

  const innerWidth = width - marginLeft - marginRight;
  const innerHeight = height - marginTop - marginBottom;

  const dateScale = scaleTime({
    domain: [dateFrom, dateTo],
    range: [0, innerWidth],
  });
  const timeTicks = getTimeAxisTicks(dateFrom, dateTo);
  // We remove the last tick to make room for the Today marker
  const xTicks = timeTicks.slice(0, timeTicks.length - 1);
  const timeTickFormat = isMobile ? 'MMM' : 'MMMM D';
  const xTickFormat = (date: Date) => moment(date).format(timeTickFormat);
  const barWidth = 0.8 * (innerWidth / numDays);

  const yScale = scaleLinear({
    domain: [0, maxY],
    range: [innerHeight, 0],
  });

  const { tooltipOpen, tooltipData, hideTooltip, showTooltip } = useTooltip<{
    date: Date;
  }>();

  const onMouseOver = useCallback(
    ({ x }: { x: number }) => {
      const date = dateScale.invert(x - marginLeft);
      showTooltip({
        tooltipData: { date },
      });
    },
    [showTooltip, dateScale, marginLeft],
  );

  const getXPosition = (d: Column) => dateScale(getDate(d)) || 0;
  const getYPosition = (d: Column) => yScale(getY(d));

  // Note(Chelsi): !barOpacity makes sure change isn't applied to share image chart:
  const axisGridColor = !barOpacity ? `${COLOR_MAP.GRAY_EXPLORE_CHART}` : '';

  return (
    <Styles.PositionRelative style={{ height }}>
      <svg width={width} height={height}>
        <Group key="chart-container" top={marginTop} left={marginLeft}>
          <ChartStyle.LineGrid exploreStroke={axisGridColor}>
            <GridColumns<Date> scale={dateScale} height={innerHeight} />
            <GridRows<number> scale={yScale} width={innerWidth} />
          </ChartStyle.LineGrid>
          <RectClipGroup width={innerWidth} height={innerHeight}>
            {series.map(({ label, data, type, params }) => (
              <SeriesChart
                key={`series-chart-${label}`}
                data={data}
                x={getXPosition}
                y={getYPosition}
                type={type}
                yMax={innerHeight}
                barWidth={barWidth}
                barOpacity={barOpacity}
                chartParams={params}
              />
            ))}
          </RectClipGroup>
          {/* Today marker */}
          <ChartStyle.LineGrid exploreStroke={axisGridColor}>
            <Line
              x1={dateScale(today)}
              x2={dateScale(today)}
              y1={0}
              y2={innerHeight}
            />
          </ChartStyle.LineGrid>
          {showLabels &&
            series.map(({ label, data, params }) => (
              <Styles.LineLabel
                key={`label-${label}`}
                x={innerWidth}
                y={getYPosition(data[data.length - 1])}
                fill={params?.stroke || '#000'}
              >
                {label}
              </Styles.LineLabel>
            ))}
          <Styles.TodayLabel>
            <text x={dateScale(today)} y={innerHeight} dy={21}>
              Today
            </text>
          </Styles.TodayLabel>
          {tooltipOpen && tooltipData && (
            <DataHoverMarkers
              x={getXPosition}
              y={getYPosition}
              yMax={innerHeight}
              barWidth={barWidth}
              series={series}
              date={tooltipData.date}
              barOpacityHover={barOpacityHover}
            />
          )}
          <TooltipOverlayX
            width={innerWidth}
            height={innerHeight}
            onMouseOver={onMouseOver}
            onMouseLeave={hideTooltip}
          />
          <ChartStyle.Axis exploreStroke={axisGridColor}>
            <AxisLeft scale={yScale} />
            <AxisBottom
              top={innerHeight}
              scale={dateScale}
              tickValues={xTicks}
              tickFormat={xTickFormat}
            />
          </ChartStyle.Axis>
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <SingleLocationTooltip
          left={p => getXPosition(p) + marginLeft}
          top={p => getYPosition(p) + marginTop}
          date={tooltipData.date}
          series={series}
          subtext={tooltipSubtext}
        />
      )}
      {tooltipOpen && tooltipData && (
        <DateMarker
          left={dateScale(tooltipData.date) + marginLeft}
          date={tooltipData.date}
        />
      )}
      {width > 0 && <ScreenshotReady />}
    </Styles.PositionRelative>
  );
};

export default ExploreChart;
