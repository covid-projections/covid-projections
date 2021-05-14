import React, { Fragment } from 'react';
import RegionItem from './RegionItem';
import RegionItemSkeleton from './RegionItemSkeleton';
import { RegionItemsWrapper } from 'screens/HomePage/HomePage.style';
import { GeolocatedRegions, Region } from 'common/regions';

enum ItemsState {
  LOADING,
  READY,
  NOT_FOUND,
}

const HomepageItems: React.FC<{
  userRegions: GeolocatedRegions | null;
  isLoading: boolean;
}> = ({ userRegions, isLoading }) => {
  const itemsState = isLoading
    ? ItemsState.LOADING
    : userRegions
    ? ItemsState.READY
    : ItemsState.NOT_FOUND;

  if (itemsState === ItemsState.NOT_FOUND) {
    return null;
  }

  const visibleRegions = userRegions ? getRegionList(userRegions) : [];

  return (
    <RegionItemsWrapper>
      {itemsState === ItemsState.LOADING && (
        <Fragment>
          <RegionItemSkeleton />
          <RegionItemSkeleton />
        </Fragment>
      )}
      {itemsState === ItemsState.READY && (
        <Fragment>
          {visibleRegions.map(region => (
            <RegionItem region={region} key={region.fipsCode} />
          ))}
        </Fragment>
      )}
    </RegionItemsWrapper>
  );
};

function getRegionList(geolocatedRegions: GeolocatedRegions): Region[] {
  const { county, state, metroArea } = geolocatedRegions;
  const items = [];
  if (state) {
    items.push(state);
  }
  if (county) {
    items.push(county);
  }
  // **only if for some strange reason** a state or a county item is missing from
  // the geolocated regions but there is a metroArea, we show the metroArea
  if (metroArea && items.length < 2) {
    items.push(metroArea);
  }
  return items;
}

export default HomepageItems;
