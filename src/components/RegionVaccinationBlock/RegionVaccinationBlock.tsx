import React, { Fragment } from 'react';
import { Region } from 'common/regions';
import {
  RegionVaccinationInfo,
  getVaccinationDataByRegion,
} from 'cms-content/vaccines';
import ExternalLink from 'components/ExternalLink';
import LinkButton from './LinkButton';
import {
  Heading3,
  ButtonContainer,
  Heading2,
  Paragraph,
  Container,
} from './RegionVaccinationBlock.style';
import {
  getVaccinationRegions,
  VaccinationLink,
  trackVaccinationLink,
} from './utils';

const VaccinationBlock: React.FC<{ region: Region }> = ({ region }) => {
  const vaccinationRegions = getVaccinationRegions(region);

  const vaccinationRegionsData = vaccinationRegions
    .map(getVaccinationDataByRegion)
    .filter((data): data is RegionVaccinationInfo => data !== null);

  if (!vaccinationRegionsData) {
    return null;
  }

  const eligibilityLinks: VaccinationLink[] = vaccinationRegionsData.map(
    data => ({ label: data.locationName, url: data.eligibilityInfoUrl }),
  );

  const vaccinationOptionsLinks: VaccinationLink[] = vaccinationRegionsData
    .map(data =>
      data.vaccinationSignupUrl
        ? {
            label: data.locationName,
            url: data.vaccinationSignupUrl,
          }
        : null,
    )
    .filter((link): link is VaccinationLink => link !== null);

  return (
    <Container>
      <Heading2>Vaccines</Heading2>
      <Paragraph>
        Below are government resources to help you get vaccinated. If something
        is missing or incorrect,{' '}
        <ExternalLink
          href="https://forms.gle/saHnT8RtDGqRaHHD8"
          onClick={() => trackVaccinationLink('Suggest an improvement')}
        >
          please let us know
        </ExternalLink>
        .
      </Paragraph>
      {eligibilityLinks.length > 0 && (
        <Fragment>
          <Heading3>
            <strong>When</strong> can I get vaccinated if I’m in...
          </Heading3>
          <VaccinationLinksBlock
            links={eligibilityLinks}
            trackingLinkPrefix="Eligibility"
          />
        </Fragment>
      )}
      {vaccinationOptionsLinks.length > 0 && (
        <Fragment>
          <Heading3>
            <strong>Where and how</strong> do I get vaccinated if I’m in...
          </Heading3>
          <VaccinationLinksBlock
            links={vaccinationOptionsLinks}
            trackingLinkPrefix="Options"
          />
        </Fragment>
      )}
    </Container>
  );
};

// TODO: Add tracking for these links
const VaccinationLinksBlock: React.FC<{
  links: VaccinationLink[];
  trackingLinkPrefix: string;
}> = ({ links, trackingLinkPrefix }) => (
  <ButtonContainer>
    {links.map(({ label, url }) => (
      <LinkButton
        href={url}
        key={label}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackVaccinationLink(`${trackingLinkPrefix}: ${label}`)}
      >
        {label}
      </LinkButton>
    ))}
  </ButtonContainer>
);

export default VaccinationBlock;
