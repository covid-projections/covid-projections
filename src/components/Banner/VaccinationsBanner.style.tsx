import styled from 'styled-components';
import { materialSMBreakpoint } from 'assets/theme/sizes';
import { COLOR_MAP } from 'common/colors';
import LinkButton from 'components/LinkButton';

export const Wrapper = styled.div`
  background-color: ${COLOR_MAP.LIGHTGRAY_BG};
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.5rem 1.75rem;
  align-items: center;
  justify-content: center;

  @media (min-width: ${materialSMBreakpoint}) {
    flex-direction: row;
    padding: 2.5rem 1rem;
  }
`;

export const CompareButton = styled(LinkButton).attrs(props => ({
  variant: 'contained',
}))`
  background-color: ${COLOR_MAP.BLUE};
  color: white;
  box-shadow: box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);

  &:hover{
    background-color: ${COLOR_MAP.BLUE};
  }
  `;

export const SearchButton = styled(LinkButton).attrs(props => ({
  variant: 'text',
}))`
  background-color: ${COLOR_MAP.LIGHTGRAY_BG};
  color: ${COLOR_MAP.BLUE};
  box-shadow: none;
  margin-left: 0.5rem;
  &:hover {
    text-decoration: underline;
    background-color: ${COLOR_MAP.LIGHTGRAY_BG};
    box-shadow: none;
  }
`;

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (min-width: ${materialSMBreakpoint}) {
    align-items: flex-start;
    text-align: left;
    max-width: 520px;
  }
`;

export const Header = styled.span`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

export const Body = styled.span`
  color: ${COLOR_MAP.GRAY_BODY_COPY};
  font-size: 15px;
  margin-bottom: 1.25rem;
  line-height: 1.5;
`;
