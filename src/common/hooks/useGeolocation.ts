/*
  Captures the user's location using IP-API (https://ip-api.com/)
  Returns either undefined or an object with user's zipCode, stateCode, and country

  Note: only works on prod + main staging. Won't work locally or in preview links.
  Hardcode ipData to test UI.
*/

import { useEffect, useState } from 'react';
import { IP_API_KEY } from 'common/ip-api';

// move this elsewhere
export interface GeolocationInfo {
  zipCode: string;
  stateCode: string;
  country: string;
}

export default function useGeolocation(): GeolocationInfo | undefined {
  const [ipData, setIpData] = useState<GeolocationInfo | undefined>();

  useEffect(() => {
    const fetchIpData = () => {
      fetch(`https://pro.ip-api.com/json/?key=${IP_API_KEY}`)
        .then(response => response.json())
        .then(data =>
          setIpData({
            zipCode: data.zip,
            stateCode: data.region,
            country: data.country,
          }),
        )
        .catch(e => console.error(e));
    };
    fetchIpData();
  }, []);

  return ipData;
}
