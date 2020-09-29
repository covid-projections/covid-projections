import React, { useCallback, Fragment } from 'react';
import { isNumber } from 'lodash';
import { Group } from '@vx/group';
import { scaleTime, scaleLinear } from '@vx/scale';
import { useTooltip } from '@vx/tooltip';
import { formatDecimal, formatUtcDate } from 'common/utils';
import { Column } from 'common/models/Projection';
import { Tooltip, RectClipGroup } from 'components/Charts';
import { Series } from './interfaces';
import ChartSeries, { SeriesMarker } from './SeriesChart';
import { getMaxBy, getSeriesLabel } from './utils';
import * as Styles from './Explore.style';
import { ScreenshotReady } from 'components/Screenshot';
import TodayMarker from './TodayMarker';
import SeriesTooltipOverlay, { HoverPointInfo } from './SeriesTooltipOverlay';
import { Line } from '@vx/shape';
import DateMarker from './DateMarker';
import GridLines from './GridLines';
import Axes from './Axes';

const getDate = (d: Column) => new Date(d.x);
const getY = (d: Column) => d.y;

function getSeriesOpacity(
  currentSeriesIndex: number,
  tooltipOpen: boolean,
  tooltipData?: HoverPointInfo,
) {
  return tooltipOpen &&
    tooltipData &&
    tooltipData.seriesIndex !== currentSeriesIndex
    ? 0.3
    : 1;
}

const MultipleLocationsTooltip: React.FC<{
  top: number;
  left: number;
  seriesList: Series[];
  pointInfo: HoverPointInfo;
}> = ({ top, left, seriesList: series, pointInfo }) => {
  const { seriesIndex } = pointInfo;
  const currentSeries = isNumber(seriesIndex) ? series[seriesIndex] : null;
  return (
    <Tooltip
      width={'210px'}
      top={top}
      left={left}
      title={formatUtcDate(new Date(pointInfo.x), 'MMM D, YYYY')}
    >
      <Styles.TooltipSubtitle>
        {currentSeries && currentSeries.tooltipLabel}
      </Styles.TooltipSubtitle>
      <Styles.TooltipMetric>
        {isNumber(pointInfo.y) ? formatDecimal(pointInfo.y, 1) : '-'}
      </Styles.TooltipMetric>
      <Styles.TooltipLocation>
        {currentSeries && `in ${currentSeries.label}`}
      </Styles.TooltipLocation>
    </Tooltip>
  );
};

const HoverDataMarker: React.FC<{
  seriesList: Series[];
  pointInfo: HoverPointInfo;
  x: (p: Column) => number;
  y: (p: Column) => number;
  height: number;
}> = ({ seriesList, pointInfo, height, x, y }) => {
  const { seriesIndex, pointIndex } = pointInfo;
  const currentSeries = isNumber(seriesIndex) ? seriesList[seriesIndex] : null;
  const currentPoint =
    isNumber(pointIndex) && currentSeries
      ? currentSeries.data[pointIndex]
      : null;
  const x0 = x(pointInfo);
  return (
    <Fragment>
      <Styles.HoverTrackerLine>
        <Line x1={x0} x2={x0} y1={0} y2={height} />
      </Styles.HoverTrackerLine>
      {currentSeries && currentPoint && (
        <SeriesMarker
          key="series-marker"
          type={currentSeries.type}
          data={[currentPoint]}
          x={x}
          y={y}
          date={new Date(currentPoint.x)}
          yMax={height}
          barWidth={0}
          barOpacityHover={0}
          params={{ fill: currentSeries?.params?.fill }}
        />
      )}
    </Fragment>
  );
};

const MultipleLocationsChart: React.FC<{
  width: number;
  height: number;
  seriesList: Series[];
  isMobile: boolean;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  barOpacity?: number;
  isMobileXs?: boolean;
}> = ({
  width,
  height,
  seriesList,
  isMobile,
  marginTop = 10,
  marginBottom = 30,
  marginLeft = 60,
  marginRight = 100,
  barOpacity,
  isMobileXs = false,
}) => {
  const dateFrom = new Date('2020-03-01');
  const dateTo = new Date();
  const maxY = getMaxBy<number>(seriesList, getY, 1);

  const innerWidth = width - marginLeft - marginRight;
  const innerHeight = height - marginTop - marginBottom;

  const dateScale = scaleTime({
    domain: [dateFrom, dateTo],
    range: [0, innerWidth],
  });

  const yScale = scaleLinear({
    domain: [0, maxY],
    range: [innerHeight, 0],
  });

  const { tooltipOpen, tooltipData, hideTooltip, showTooltip } = useTooltip<
    HoverPointInfo
  >();

  const onMouseOver = useCallback(
    (pointInfo: HoverPointInfo) => {
      showTooltip({ tooltipData: pointInfo });
    },
    [showTooltip],
  );

  const getXPosition = (d: Column) => dateScale(getDate(d)) || 0;
  const getYPosition = (d: Column) => yScale(getY(d));

  return (
    <Styles.PositionRelative style={{ height }}>
      <svg width={width} height={height}>
        <Group key="chart-container" top={marginTop} left={marginLeft}>
          <GridLines
            width={innerWidth}
            height={innerHeight}
            dateScale={dateScale}
            yScale={yScale}
            numTicksRows={5}
          />
          <Axes
            height={innerHeight}
            dateScale={dateScale}
            yScale={yScale}
            isMobile={isMobile}
            yNumTicks={5}
          />
          <TodayMarker height={innerHeight} dateScale={dateScale} />
          {seriesList.map((series, i) => {
            const seriesColor = series.params?.stroke || '#000';
            return series.data.length > 0 ? (
              <Styles.LineLabel
                key={`label-${series.label}`}
                x={innerWidth + 5}
                y={getYPosition(series.data[series.data.length - 1])}
                fill={seriesColor}
                fillOpacity={getSeriesOpacity(i, tooltipOpen, tooltipData)}
              >
                {getSeriesLabel(series, isMobileXs)}
              </Styles.LineLabel>
            ) : null;
          })}
          <RectClipGroup width={innerWidth} height={innerHeight}>
            {seriesList.map(({ label, data, type, params }, i) => (
              <ChartSeries
                key={`series-chart-${label}`}
                data={data}
                x={getXPosition}
                y={getYPosition}
                type={type}
                yMax={innerHeight}
                barWidth={0}
                barOpacity={0}
                params={{
                  ...params,
                  strokeOpacity: getSeriesOpacity(i, tooltipOpen, tooltipData),
                }}
              />
            ))}
          </RectClipGroup>
          {tooltipOpen && tooltipData && (
            <HoverDataMarker
              seriesList={seriesList}
              pointInfo={tooltipData}
              x={getXPosition}
              y={getYPosition}
              height={innerHeight}
            />
          )}
          <SeriesTooltipOverlay
            seriesList={seriesList}
            width={innerWidth}
            height={innerHeight}
            x={getXPosition}
            y={getYPosition}
            onMouseOver={onMouseOver}
            onMouseOut={hideTooltip}
          />
        </Group>
      </svg>
      {width > 0 && seriesList.length > 0 && <ScreenshotReady />}
      {tooltipOpen && tooltipData && (
        <Fragment>
          <MultipleLocationsTooltip
            seriesList={seriesList}
            pointInfo={tooltipData}
            left={getXPosition(tooltipData) + marginLeft}
            top={getYPosition(tooltipData) + marginTop}
          />
          <DateMarker
            left={getXPosition(tooltipData) + marginLeft}
            date={new Date(tooltipData.x)}
          />
        </Fragment>
      )}
    </Styles.PositionRelative>
  );
};

export default MultipleLocationsChart;
