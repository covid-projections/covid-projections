import React from 'react';
import { useParams, Redirect } from 'react-router-dom';
import regions, { RegionContext, useRegionFromParams } from 'common/regions';
import LocationPage from './LocationPage';

interface LocationPageUrlParams {
  stateId: string;
  countyId: string | undefined;
}

const LocationRouter: React.FC = () => {
  const region = useRegionFromParams();
  if (!region) {
    return <Redirect to="/" />;
  }

  return (
    <RegionContext.Provider value={region}>
      <LocationPage region={region} />
    </RegionContext.Provider>
  );
};

export default LocationRouter;
