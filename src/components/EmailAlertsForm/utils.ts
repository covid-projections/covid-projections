import { getFirebase, firebase } from 'common/firebase';
import { Region, County } from 'common/regions';

export function getDefaultRegions(region: Region): Region[] {
  return region instanceof County ? [region, region.state] : [region];
}

export function subscribeToLocations(emailAddress: string, fipsList: string[]) {
  // Merge the locations with any existing ones since that's _probably_ what the user wants.
  return getFirebase()
    .firestore()
    .collection('alerts-subscriptions')
    .doc(emailAddress.toLocaleLowerCase())
    .set(
      {
        locations: firebase.firestore.FieldValue.arrayUnion(...fipsList),
        subscribedAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
}

export const CREATESEND_DATA_ID =
  '2BE4EF332AA2E32596E38B640E90561930C9C3A433D015D9D4BD88E99175E51395EF5EBFFD527179E032AC15455BB1208D87A6CE87843E524B0EA520CBFF446E';

export async function subscribeToDailyDownload(emailAddress: string) {
  let url = new URL('https://createsend.com/t/getsecuresubscribelink');
  url.searchParams.append('email', encodeURIComponent(emailAddress));
  url.searchParams.append('data', CREATESEND_DATA_ID);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
    },
  });

  return response.text();
}