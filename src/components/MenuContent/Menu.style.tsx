import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { COLOR_MAP } from 'common/colors';
import { mobileBreakpoint } from 'assets/theme/sizes';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import LinkButton from 'components/LinkButton';
import fonts from 'common/theme/fonts';

export const mobileBreakpointPlus = '960px';

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1120px;
  width: 100%;
  margin: auto;

  img {
    height: 20px;
    margin-bottom: 1rem;
    align-self: center;
  }

  @media (min-width: ${mobileBreakpoint}) {
    flex-direction: row;

    img {
      align-self: flex-start;
    }
  }
`;

export const Section = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  &:not(:last-child) {
    margin-bottom: 2.5rem;
  }

  &:last-child {
    align-items: ${props =>
      props.theme.palette.megaMenu.aboutUsContentAlignment};
  }

  @media (min-width: ${mobileBreakpoint}) {
    &:not(:last-child) {
      margin-bottom: 0;
      margin-right: 3.5rem;
    }

    &:last-child {
      align-items: flex-start;
    }
  }

  @media (min-width: ${mobileBreakpointPlus}) {
    &:not(:last-child) {
      margin-right: 5rem;
    }
  }
`;

export const SectionHeader = styled.h2<{ $desktopOnly?: boolean }>`
  ${fonts.regularBookMidWeight};
  color: ${props => props.theme.palette.megaMenu.gray};
  text-transform: uppercase;
  margin: 0 0 1.25rem;
  font-size: 1rem;
  display: ${({ $desktopOnly }) => ($desktopOnly ? 'none' : 'inherit')};

  @media (min-width: ${mobileBreakpoint}) {
    display: inherit;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ArrowIcon = styled(ArrowForwardIcon)`
  color: ${props => props.theme.palette.megaMenu.gray};
  font-size: 1.25rem;
  margin-left: 0.5rem;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 0.25rem;
`;

export const BodyCopy = css`
  ${fonts.regularBook};
  line-height: 1.4;
  margin: 0;
`;

export const FeaturedDescription = styled.p`
  ${BodyCopy};
  letter-spacing: 0;
  color: ${props => props.theme.palette.megaMenu.secondaryText};
`;

export const AboutCopy = styled.p`
  ${BodyCopy};
  color: ${props => props.theme.palette.megaMenu.secondaryText};
  margin-bottom: 2rem;
  text-align: ${props => props.theme.palette.megaMenu.aboutUsTextAlignment};

  @media (min-width: ${mobileBreakpoint}) {
    text-align: left;
  }
`;

export const ButtonBase = css`
  ${fonts.regularBookMidWeight};
  width: fit-content;
  text-transform: none;
  line-height: 1.4;
`;

export const TextLink = styled(Link)`
  ${ButtonBase};
  ${fonts.regularBookMidWeight};

  color: ${props => props.theme.palette.megaMenu.primaryText};

  font-size: 1rem;
  padding: 0;
  text-decoration: none;

  &:hover {
    ${ArrowIcon} {
      transform: translateX(6px);
      transition: transform 0.06s ease-in-out;
    }
  }
`;

export const LearnLink = styled(TextLink)`
  &:not(:last-of-type) {
    margin-bottom: 0.5rem;
  }

  ${ArrowIcon} {
    margin-bottom: -4px;
  }

  @media (min-width: ${mobileBreakpoint}) {
    &:last-of-type {
      margin-bottom: 1.75rem;
    }
  }
`;

export const OutlinedButton = styled(LinkButton)`
  ${ButtonBase};
  color: ${props => props.theme.palette.megaMenu.buttonContent};
  font-size: 0.8725rem;
  padding: 0.4rem 0.75rem;
  border: ${props => `1px solid ${props.theme.palette.megaMenu.buttonBorder}`};
  white-space: nowrap;
  margin-top: 2rem;

  &:nth-child(2) {
    margin-left: 0.75rem;
  }

  &:hover {
    background-color: rgba(83, 97, 253, 0.6);
    border-color: ${COLOR_MAP.NEW_BLUE_PURPLE};
    color: white;
  }

  @media (min-width: ${mobileBreakpoint}) {
    margin-top: 0;
  }
`;

export const RowWithSpacing = styled(Row)`
  margin-bottom: 0;
  &:not(:last-of-type) {
    margin-bottom: 1.75rem;
  }

  ${OutlinedButton} {
    margin-top: 0;
  }
`;

export const SocialButtonsRow = styled.div`
    display: flex;
    svg {
        fill: ${props => props.theme.palette.megaMenu.buttonContent};
        font-size: 1.75rem;
        &:hover {
          fill: ${COLOR_MAP.NEW_BLUE_PURPLE};
        }
    }
    a {
      color: white;
        &:not(:last-of-type) {
            margin-right: 1rem;
        }
        &:last-of-type {
          align-self: center;
      }
    }
    }
`;

export const IconWrapper = styled.div`
  display: block;
  margin-right: 1rem;
`;

export const LogoWrapper = styled(Link)`
  line-height: 1;
  margin: 1rem 0 1.25rem;

  @media (min-width: ${mobileBreakpoint}) {
    margin: 0 0 1.25rem;
  }
`;

export const NonWrappingSpan = styled.span`
  white-space: nowrap;
  ${fonts.regularBookMidWeight};
`;