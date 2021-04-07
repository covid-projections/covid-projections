import React, { ComponentType } from 'react';
import keyBy from 'lodash/keyBy';
import { menuContent } from 'cms-content/footer';
import FeaturedSection from './FeaturedSection';
import LearnSection from './LearnSection';
import AboutUsSection from './AboutUsSection';
import { ContentWrapper } from './Menu.style';
import { useBreakpoint } from 'common/hooks';
import {
  Experiment,
  ExperimentID,
  Variant,
  VariantID,
} from 'components/Experiment';
import { FeaturedItem, SectionId } from 'cms-content/footer';

const FeaturedSectionVariant: React.FC<{
  featuredSections: FeaturedItem[];
  onClick: (label: string) => void;
}> = ({ featuredSections, onClick }) => {
  const sectionById = keyBy(featuredSections, section => section.iconId);

  const orderedSectionsA = [
    sectionById[SectionId.ALERTS],
    sectionById[SectionId.DAILY_DOWNLOAD],
    sectionById[SectionId.API],
  ];
  const orderedSectionsB = [
    sectionById[SectionId.API],
    sectionById[SectionId.ALERTS],
    sectionById[SectionId.DAILY_DOWNLOAD],
  ];

  return (
    <Experiment id={ExperimentID.MEGA_MENU_API_LINK}>
      <Variant id={VariantID.A}>
        <FeaturedSection
          featuredSections={orderedSectionsA}
          onClick={onClick}
        />
      </Variant>
      <Variant id={VariantID.B}>
        <FeaturedSection
          featuredSections={orderedSectionsB}
          onClick={onClick}
        />
      </Variant>
    </Experiment>
  );
};

const MenuContent: React.FC<{
  onClick: (label: string) => void;
  Logo?: ComponentType;
}> = ({ onClick, Logo }) => {
  const { learnLinks, aboutUs, featuredSections } = menuContent;

  const isMobile = useBreakpoint(800);

  return (
    <ContentWrapper>
      {isMobile ? (
        <>
          <FeaturedSectionVariant
            featuredSections={featuredSections}
            onClick={onClick}
          />
          <LearnSection learnLinks={learnLinks} onClick={onClick} />
          <AboutUsSection aboutUsCopy={aboutUs} onClick={onClick} Logo={Logo} />
        </>
      ) : (
        <>
          <LearnSection learnLinks={learnLinks} onClick={onClick} />
          <FeaturedSectionVariant
            featuredSections={featuredSections}
            onClick={onClick}
          />

          <AboutUsSection aboutUsCopy={aboutUs} onClick={onClick} Logo={Logo} />
        </>
      )}
    </ContentWrapper>
  );
};

export default MenuContent;
