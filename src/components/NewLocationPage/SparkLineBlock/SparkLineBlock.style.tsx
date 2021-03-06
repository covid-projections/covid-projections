import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Chevron } from '../Shared/Shared.style';
import { BaseButton } from 'components/Button';
import { mobileBreakpoint } from 'assets/theme/sizes';

export const ChartTitleWrapper = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
  line-height: 1.2;
  letter-spacing: 0;
  ${Chevron} {
    transform: translateY(-1px);
  }
`;

export const TitleItem = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const IconItem = styled.div`
  flex: 1 0 24px;
`;

export const ChartTitle = styled.span`
  ${props => props.theme.fonts.regularBookMidweight};
  font-size: 1rem;
`;

// Specific pixel dimensions via mocks
export const SingleSparkLineContainer = styled.div`
  height: 48px;
`;

export const StyledLink = styled(Link)`
  color: black;
  text-decoration: none;

  &:not(:last-of-type) {
    margin-right: 1rem;
  }

  &:hover {
    ${Chevron} {
      transform: translate(6px, -1px);
      transition: transform 0.06s ease-in-out;
    }
  }
`;

export const WrappingButton = styled(BaseButton)`
  ${props => props.theme.fonts.regularBookMidWeight};
  font-size: inherit;
  text-transform: inherit;
  text-align: left;
  display: inherit;
  padding: 0;

  &:hover {
    background-color: transparent;
    ${Chevron} {
      transform: translate(6px, -1px);
      transition: transform 0.06s ease-in-out;
    }
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-gap: 1.25rem;

  @media (min-width: ${mobileBreakpoint}) {
    grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));
  }
`;

export const GridItem = styled.div``;
