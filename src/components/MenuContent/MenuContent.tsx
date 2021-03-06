import React, { ComponentType } from 'react';
import { menuContent } from 'cms-content/footer';
import FeaturedSection from './FeaturedSection';
import LearnSection from './LearnSection';
import AboutUsSection from './AboutUsSection';
import { ContentWrapper } from './Menu.style';
import { useBreakpoint } from 'common/hooks';

const MenuContent: React.FC<{
  onClick: (label: string) => void;
  Logo?: ComponentType;
}> = ({ onClick, Logo }) => {
  const { learn, aboutUs, featuredSections } = menuContent;

  const isMobile = useBreakpoint(800);

  return (
    <ContentWrapper>
      {isMobile ? (
        <>
          <FeaturedSection
            featuredSections={featuredSections}
            onClick={onClick}
          />
          <LearnSection learnCopy={learn} onClick={onClick} />
          <AboutUsSection aboutUsCopy={aboutUs} onClick={onClick} Logo={Logo} />
        </>
      ) : (
        <>
          <LearnSection learnCopy={learn} onClick={onClick} />
          <FeaturedSection
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
