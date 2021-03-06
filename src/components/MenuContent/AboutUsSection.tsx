import React, { ComponentType } from 'react';
import isUndefined from 'lodash/isUndefined';
import SocialButtonsBlock from './SocialButtonsBlock';
import {
  Section,
  SectionHeader,
  OutlinedButton,
  ParagraphCopy,
  LogoWrapper,
  RowWithSpacing,
} from './Menu.style';

const AboutUsSection: React.FC<{
  aboutUsCopy: string;
  onClick: (label: string) => void;
  Logo?: ComponentType;
}> = ({ aboutUsCopy, onClick, Logo }) => {
  const isFooter = !isUndefined(Logo);

  return (
    <Section>
      {Logo ? (
        <LogoWrapper
          to="/"
          aria-label="Covid Act Now"
          onClick={() => onClick('Logo')}
        >
          <Logo />
        </LogoWrapper>
      ) : (
        <SectionHeader>About Us</SectionHeader>
      )}
      <ParagraphCopy>{aboutUsCopy}</ParagraphCopy>
      <RowWithSpacing>
        <OutlinedButton to="/about" onClick={() => onClick('About us')}>
          Learn more about us
        </OutlinedButton>
        <OutlinedButton
          to="/about#contact-us"
          onClick={() => onClick('Contact us')}
        >
          Contact us
        </OutlinedButton>
      </RowWithSpacing>
      <SocialButtonsBlock showTerms={isFooter} />
    </Section>
  );
};

export default AboutUsSection;
