import React, { Fragment } from 'react';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import { useIsEmbed } from 'common/utils/hooks';
import { LOCATION_SUMMARY_LEVELS } from 'common/metrics/location_summary';
import { Level } from 'common/level';
import { COLOR_MAP } from 'common/colors';
import { Metric } from 'common/metric';
import { useModelLastUpdatedDate } from 'common/utils/model';
import { Projections } from 'common/models/Projections';
import { formatUtcDate } from 'common/utils';
import { Region } from 'common/regions';
import LocationHeaderStats from 'components/SummaryStats/LocationHeaderStats';
import { ThermometerImage } from 'components/Thermometer';
import LocationPageHeading from './LocationPageHeading';
import NotificationArea from './Notifications';
import {
  ColoredHeaderBanner,
  Wrapper,
  TopContainer,
  FooterContainer,
  HeaderSection,
  HeaderSubCopy,
  ButtonsWrapper,
  HeaderButton,
  LastUpdatedDate,
  SectionHalf,
  Copy,
  ColumnTitle,
  SectionColumn,
  LevelDescription,
} from 'components/LocationPage/LocationPageHeader.style';
import { MetroArea } from 'common/regions';

import { InfoTooltip, DisclaimerTooltip } from 'components/InfoTooltip';
import { renderTooltipContent } from 'components/InfoTooltip';
import {
  metricToTooltipContentMap,
  metricToCalculationTooltipContentMap,
} from 'cms-content/infoTooltips'; //Chelsi:consolidate

function renderInfoTooltip(): React.ReactElement {
  const body =
    'Our 5 color COVID risk level looks at three things: daily new cases (per 100K), infection rate, and test positivity. Each is graded on a 5 color scale and the highest risk color becomes the location’s overall risk level.\n\nFor instance, if daily new cases and test positivity are both yellow, but infection rate is orange, then the overall risk level is orange.';
  const cta =
    '[Keep reading to learn more about risk levels and metrics](https://covidactnow.org/covid-risk-levels-metrics).';

  return (
    <InfoTooltip
      title={renderTooltipContent(body, cta)}
      aria-label={`Description of risk levels`}
    />
  );
}

const noop = () => {};

const LocationPageHeader = (props: {
  projections: Projections;
  condensed?: boolean;
  stats: { [key: string]: number | null };
  onMetricClick: (metric: Metric) => void;
  onHeaderShareClick: () => void;
  onHeaderSignupClick: () => void;
  isMobile?: boolean;
  region: Region;
}) => {
  const hasStats = !!Object.values(props.stats).filter(
    (val: number | null) => val !== null,
  ).length;
  const { projections, region } = props;

  //TODO (chelsi): get rid of this use of 'magic' numbers
  const headerTopMargin = !hasStats ? -202 : -218;
  const headerBottomMargin = !hasStats ? 0 : 0;

  const alarmLevel = projections.getAlarmLevel();

  const levelInfo = LOCATION_SUMMARY_LEVELS[alarmLevel];

  const fillColor =
    alarmLevel !== Level.UNKNOWN ? levelInfo.color : COLOR_MAP.GRAY.LIGHT;

  const isEmbed = useIsEmbed();

  const lastUpdatedDate: Date | null = useModelLastUpdatedDate() || new Date();
  const lastUpdatedDateString =
    lastUpdatedDate !== null ? formatUtcDate(lastUpdatedDate) : '';

  const tooltip = renderInfoTooltip();

  return (
    <Fragment>
      <ColoredHeaderBanner bgcolor={fillColor} />
      <Wrapper
        condensed={props.condensed}
        headerTopMargin={headerTopMargin}
        headerBottomMargin={headerBottomMargin}
      >
        <TopContainer>
          <HeaderSection>
            <LocationPageHeading region={region} isEmbed={isEmbed} />
            <ButtonsWrapper>
              <HeaderButton onClick={props.onHeaderShareClick || noop}>
                <ShareOutlinedIcon />
                Share
              </HeaderButton>
              <HeaderButton onClick={props.onHeaderSignupClick || noop}>
                <NotificationsNoneIcon />
                Receive alerts
              </HeaderButton>
            </ButtonsWrapper>
          </HeaderSection>
          <HeaderSection>
            <SectionHalf>
              <ThermometerImage currentLevel={alarmLevel} />
              <SectionColumn>
                <ColumnTitle>Covid risk level {tooltip}</ColumnTitle>
                <LevelDescription>{levelInfo.summary}</LevelDescription>
                <Copy>
                  {levelInfo.detail(
                    region instanceof MetroArea
                      ? region.shortName
                      : region.name,
                  )}
                </Copy>
              </SectionColumn>
            </SectionHalf>
            <SectionHalf>
              <NotificationArea projections={projections} />
            </SectionHalf>
          </HeaderSection>
          <LocationHeaderStats
            stats={props.stats}
            onMetricClick={props.onMetricClick}
            isMobile={props.isMobile}
            isHeader={true}
          />
        </TopContainer>
        <FooterContainer>
          {projections.isCounty && !isEmbed && (
            <HeaderSubCopy>
              <span>Updated {lastUpdatedDateString} · </span>
              <span>See something wrong? </span>
              <a
                href="mailto:info@covidactnow.org?subject=[Website%20Feedback]"
                target="_blank"
                rel="noopener noreferrer"
              >
                Email us
              </a>
              .
            </HeaderSubCopy>
          )}
          {!projections.isCounty && !isEmbed && (
            <HeaderSubCopy>
              <LastUpdatedDate>Updated {lastUpdatedDateString}</LastUpdatedDate>
            </HeaderSubCopy>
          )}
        </FooterContainer>
      </Wrapper>
    </Fragment>
  );
};

export default LocationPageHeader;
