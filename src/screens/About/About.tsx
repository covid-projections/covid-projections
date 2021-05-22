import React, { Fragment } from 'react';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { EventCategory } from 'components/Analytics';
import AppMetaTags from 'components/AppMetaTags/AppMetaTags';
import { LargeOutlinedButton } from 'components/ButtonSystem';
import ExpandableContainer from 'components/ExpandableContainer';
import { LogoGridItem } from 'components/LogoGrid/LogoGrid';
import {
  AboutHeading1,
  AboutHeading2,
  ButtonContainer,
  CommitmentBody,
  CommitmentIcon,
  CommitmentItem,
  HashWrapper,
  PartnersSectionWrapper,
  SectionContent,
} from './About.style';
import aboutContent, {
  CommitmentsContent,
  LogoItem,
  PartnersContent,
} from 'cms-content/about';
import { MarkdownContent } from 'components/Markdown';
import PageContent from 'components/PageContent';
import { TocItem } from 'cms-content/utils';
import TeamSection from './Team/TeamSection';
import { StyledGridContainer } from './About.style';

export const sidebarItems: TocItem[] = [
  {
    label: 'About',
    to: '/about',
    items: [
      {
        to: '/about#about',
        label: aboutContent.aboutHeader,
      },
      {
        to: '/about#mission',
        label: aboutContent.missionHeader,
      },
      {
        to: '/about#impact',
        label: aboutContent.impactHeader,
      },
      {
        to: '/about#partners',
        label: aboutContent.partnersHeader,
      },
      {
        to: '/about#team',
        label: aboutContent.teamHeader,
      },
      {
        to: '/about#future-projects',
        label: aboutContent.futureProjectsHeader,
      },
      {
        to: '/about#contact-us',
        label: aboutContent.contactUsHeader,
      },
    ],
  },
];

// TODO(Chelsi): put these ids into the CMS
const Button: React.FC<{ to: string; cta: string }> = ({ to, cta }) => {
  return (
    <LargeOutlinedButton to={to} endIcon={<ArrowForwardIcon />}>
      {cta}
    </LargeOutlinedButton>
  );
};

const About = () => {
  return (
    <Fragment>
      <AppMetaTags
        canonicalUrl="/about"
        pageTitle="About Covid Act Now"
        pageDescription="Covid Act Now is a multidisciplinary team of technologists, epidemiologists, and health experts working to help Americans understand  COVID risk in their own community."
      />
      <PageContent sidebarItems={sidebarItems}>
        <HashWrapper id="about">
          <AboutHeading1>{aboutContent.aboutHeader}</AboutHeading1>
          <MarkdownContent source={aboutContent.aboutContent} />
          <ButtonContainer>
            <Button to="/about#team" cta="Meet our team" />
            <Button to="/about#contact-us" cta="Contact us" />
          </ButtonContainer>
        </HashWrapper>
        <HashWrapper id="mission">
          <AboutHeading1>{aboutContent.missionHeader}</AboutHeading1>
          <SectionContent>
            <MarkdownContent source={aboutContent.missionContent} />
            {aboutContent.commitmentsContent.map(
              (commitment: CommitmentsContent, idx: number) => {
                return (
                  <CommitmentItem key={`commitment-section-${idx}`}>
                    <CommitmentIcon
                      src={commitment.icon}
                      alt={commitment.altText}
                    />
                    <CommitmentBody>
                      <MarkdownContent source={commitment.copy} />
                    </CommitmentBody>
                  </CommitmentItem>
                );
              },
            )}
            <ButtonContainer>
              {/* fixme: find the right urls for this section */}
              <Button to="/data-api#faq" cta="See our data sources" />
              <Button to="/data-api#faq" cta="Download our data" />
            </ButtonContainer>
          </SectionContent>
        </HashWrapper>
        <HashWrapper id="impact">
          <AboutHeading1>{aboutContent.impactHeader}</AboutHeading1>
          <SectionContent>
            <MarkdownContent source={aboutContent.impactContent} />
          </SectionContent>
          <ButtonContainer>
            <Button to="/case-studies" cta="View case studies" />
          </ButtonContainer>
        </HashWrapper>
        <HashWrapper id="partners">
          <AboutHeading1>{aboutContent.partnersHeader}</AboutHeading1>
          <SectionContent>
            <ExpandableContainer
              collapsedHeightMobile={275}
              collapsedHeightDesktop={565}
              tabTextCollapsed={<>More</>}
              tabTextExpanded={<>Less</>}
              trackingLabel="Partners"
              trackingCategory={EventCategory.NONE}
            >
              <PartnersSectionWrapper>
                {aboutContent.partnersContent.map(
                  (section: PartnersContent, idx: number) => {
                    return (
                      <Fragment key={`Partner-section-${idx}`}>
                        <AboutHeading2>{section.header}</AboutHeading2>
                        <StyledGridContainer
                          container
                          spacing={1}
                          alignItems="center"
                          justify="center"
                        >
                          {section.logos.map((logo: LogoItem) => (
                            <LogoGridItem
                              image={logo.image}
                              url={logo.url}
                              altText={logo.altText}
                              key={logo.altText}
                            />
                          ))}
                        </StyledGridContainer>
                      </Fragment>
                    );
                  },
                )}
              </PartnersSectionWrapper>
            </ExpandableContainer>
          </SectionContent>
        </HashWrapper>
        <HashWrapper id="team">
          <AboutHeading2>{aboutContent.teamHeader}</AboutHeading2>
          <SectionContent>
            <MarkdownContent source={aboutContent.teamIntro} />
            <TeamSection />
          </SectionContent>
        </HashWrapper>
        <HashWrapper id="future-projects">
          <AboutHeading2>{aboutContent.futureProjectsHeader}</AboutHeading2>
          <SectionContent>
            <MarkdownContent source={aboutContent.futureProjectsContent} />
          </SectionContent>
        </HashWrapper>
        <AboutHeading2 id="contact-us">
          {aboutContent.contactUsHeader}
        </AboutHeading2>
        <SectionContent>
          <MarkdownContent source={aboutContent.contactUsContent} />
        </SectionContent>
      </PageContent>
    </Fragment>
  );
};

export default About;
