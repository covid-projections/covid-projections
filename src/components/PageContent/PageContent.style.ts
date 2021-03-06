import styled from 'styled-components';
import theme from 'assets/theme';
import { mobileBreakpoint } from 'assets/theme/sizes';

export const PageContainer = styled.div`
  max-width: ${theme.breakpoints.width('md')}px;
  width: 100%;
  margin: 2rem auto;
  min-height: 65vh;

  @media (min-width: ${mobileBreakpoint}) {
    margin: 3.5rem auto;
  }

  display: flex;
`;

export const MainContent = styled.main`
  max-width: 100%;
  padding: 0 1.25rem;
  flex: 1 1 auto;
`;

export const Sidebar = styled.div`
  flex: 1 1 auto;
  width: 260px;
  margin-left: ${theme.spacing(3) + theme.spacing(4)}px;
  margin-right: ${theme.spacing(1)}px;
`;

export const Sticky = styled.div`
  position: sticky;
  top: calc(64px + 2rem); // top bar height + page margin
  @media (min-width: ${mobileBreakpoint}) {
    top: calc(64px + 3.5rem);
  }
`;

export const MobileOnly = styled.div`
  display: initial;
  @media (min-width: ${mobileBreakpoint}) {
    display: none;
  }
`;

export const DesktopOnly = styled.div`
  display: none;
  @media (min-width: ${mobileBreakpoint}) {
    display: flex;
    min-width: fit-content;
  }
`;
