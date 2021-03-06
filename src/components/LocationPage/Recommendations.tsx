import React from 'react';
import { mainContent } from 'cms-content/recommendations';
import Recommend from 'components/Recommend';
import ExpandableContainer from 'components/ExpandableContainer';
import ShareButtons from 'components/SharedComponents/ShareButtons';
import LocationPageSectionFooter from 'components/LocationPageSectionFooter/LocationPageSectionFooter';
import { DisclaimerWrapper } from 'components/LocationPage/ChartsHolder.style';
import { EventAction, EventCategory, trackEvent } from 'components/Analytics';
import ExternalLink from 'components/ExternalLink';
import { Projections } from 'common/models/Projections';
import { getRecommendationsShareUrl } from 'common/urls';
import { getRecommendations, getShareQuote } from 'common/utils/recommend';
import { Region } from 'common/regions';
import { SectionHeader } from 'components/SharedComponents';

interface RecommendationsProps {
  projections: Projections;
  recommendationsRef: React.RefObject<HTMLDivElement>;
  region: Region;
}

const Recommendations = ({
  region,
  projections,
  recommendationsRef,
}: RecommendationsProps) => {
  const alarmLevel = projections.getAlarmLevel();

  const recommendationsMainContent = getRecommendations(
    region,
    mainContent.recommendations,
  );

  const recommendsShareUrl = getRecommendationsShareUrl(region);

  const recommendsShareQuote = getShareQuote(
    projections.locationName,
    alarmLevel,
  );

  const containerProps = {
    collapsedHeightMobile: '275px',
    collapsedHeightDesktop: '165px',
    tabTextCollapsed: <>More</>,
    tabTextExpanded: <>Less</>,
    trackingLabel: 'Recommendations module',
    trackingCategory: EventCategory.RECOMMENDATIONS,
  };

  const trackSourceClick = () => {
    trackEvent(EventCategory.RECOMMENDATIONS, EventAction.REDIRECT, 'CDC');
  };

  return (
    <>
      <SectionHeader id="recommendations">Recommendations</SectionHeader>
      <ExpandableContainer {...containerProps}>
        <Recommend
          recommendations={recommendationsMainContent}
          recommendationsRef={recommendationsRef}
        />
      </ExpandableContainer>
      <LocationPageSectionFooter>
        <DisclaimerWrapper>
          Source:{' '}
          <ExternalLink
            style={{ color: 'inherit' }}
            href="https://www.cdc.gov/"
            onClick={trackSourceClick}
          >
            CDC
          </ExternalLink>
        </DisclaimerWrapper>
        <ShareButtons
          eventCategory={EventCategory.RECOMMENDATIONS}
          shareUrl={recommendsShareUrl}
          shareQuote={recommendsShareQuote}
          region={region}
        />
      </LocationPageSectionFooter>
    </>
  );
};

export default Recommendations;
