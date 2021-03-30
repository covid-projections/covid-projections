import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';

import { LocationPage } from 'screens/LocationPage';
import PageWrapper from 'screens/utils/PageWrapper';

import {
  LocationPageWrapperProps,
  makeLocationPageGetStaticProps,
  getCountyPathParams,
  countyParamsToRegion,
} from 'screens/utils/ssg_utils';
import { County, CountyObject } from 'common/regions';

const getStaticPaths: GetStaticPaths = getCountyPathParams;

const getStaticProps: GetStaticProps = makeLocationPageGetStaticProps({
  paramsToRegion: countyParamsToRegion,
});

function Location({
  regionObject,
  locationSummary,
  title,
  description,
  ccviScores,
  lastUpdatedDateString,
}: LocationPageWrapperProps) {
  const region = County.fromObject(regionObject as CountyObject);

  return (
    <PageWrapper>
      <LocationPage
        region={region}
        locationSummary={locationSummary}
        title={title}
        description={description}
        ccviScores={ccviScores}
        lastUpdatedDateString={lastUpdatedDateString}
      />
    </PageWrapper>
  );
}
export { getStaticPaths, getStaticProps };
export default Location;