import styled from 'styled-components';
import { COLOR_MAP } from 'common/colors';
import { maxContentWidth } from 'components/NewLocationPage/Shared/Shared.style';
import {
  materialSMBreakpoint,
  mobileBreakpoint,
  countyMapToFixedBreakpoint,
} from 'assets/theme/sizes';

export const MainWrapper = styled.div`
  background-color: ${COLOR_MAP.GREY_0};
  padding: 2rem 1rem;
  margin-bottom: 3rem;

  @media (min-width: ${mobileBreakpoint}) {
    padding: 2rem;
  }
`;

export const HeaderContainer = styled.div`
  padding-bottom: 0.5rem;

  @media (min-width: ${materialSMBreakpoint}) {
    display: flex;
    justify-content: space-between;
    padding-bottom: 0.5rem;
    align-items: center;
  }

  @media (min-width: ${countyMapToFixedBreakpoint}) {
    align-items: start;
  }
`;

export const GridContainer = styled.div<{ showNote: boolean }>`
  display: grid;
  max-width: ${maxContentWidth};
  margin: auto;
  row-gap: 1.25rem;
  grid-template-areas: ${({ showNote }) =>
    showNote
      ? `'header' 'overview' 'spark' 'map' 'note' 'alerts'`
      : `'header' 'overview' 'spark' 'map' 'alerts'`};

  @media (min-width: ${materialSMBreakpoint}) {
    grid-template-columns: 2fr 1fr;
    grid-gap: 2rem;
    grid-template-areas: ${({ showNote }) =>
      showNote
        ? `'header header'
    'overview overview'
    'spark map'
    'alerts alerts'
    'note note'`
        : `'header header'
    'overview overview'
    'spark map'
    'alerts alerts'`};
  }

  @media (min-width: ${mobileBreakpoint}) {
    grid-template-areas: ${({ showNote }) =>
      showNote
        ? `'header header'
      'overview overview'
      'spark map'
      'alerts map'
      'note note'`
        : `'header header'
      'overview overview'
      'spark map'
      'alerts map'`};
  }

  @media (min-width: ${countyMapToFixedBreakpoint}) {
    margin: 0 350px 0 auto;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: ${({ showNote }) =>
      showNote
        ? `'header header'
      'overview overview'
      'spark alerts'
      'note note'`
        : `'header header'
      'overview overview'
      'spark alerts'`};
  }

  @media (min-width: 1750px) {
    margin: auto;
  }
`;

export const GridItemHeader = styled.div`
  grid-area: header;
`;

export const GridItemOverview = styled.div`
  grid-area: overview;
`;

export const GridItemSparkLines = styled.div`
  grid-area: spark;
`;

export const GridItemAlerts = styled.div`
  grid-area: alerts;
`;

export const GridItemMap = styled.div`
  grid-area: map;
  align-self: start;

  @media (min-width: ${countyMapToFixedBreakpoint}) {
    display: none;
  }
`;

export const GridItemNote = styled.div`
  grid-area: note;
`;

// Need to remove the map from the grid container when it becomes position:fixed
// so there is no extra grid-gap for an empty grid item:
export const MapOutsideGrid = styled.div`
  display: none;
  @media (min-width: ${countyMapToFixedBreakpoint}) {
    display: inherit;
  }
`;
