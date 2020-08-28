import * as express from 'express';
import { takeScreenshot } from './screenshots';

// For performance analysis, it's useful to know when the script is loaded from scratch.
console.log('dynamic_web_content cold start.');

/**
 * Main express instance that will handle all of our "dynamic" web requests.
 */
export const dynamicWebContentHandler = express();

// Middleware router for /share/{snapshotId}-{shareId}/... requests that parses out the params.
const shareRouter = express.Router({mergeParams: true});
dynamicWebContentHandler.use('/share/:snapshotId-:shareId/', shareRouter);

/**
 * Handler for share image requests which takes the tail of the URL and uses
 * headless chrome to visit /internal/share-image/<url>/ and captures the
 * screenshot and serves it back as the response.
 */
shareRouter.get(/\/(.*)\.png/, (req, res) => {
  const snapshotId = req.params['snapshotId'];

  let sharePath = req.params[0];
  if (sharePath === 'home') {
    // home.png is generated from the root /internal/share-image/ URL.
    sharePath = '';
  }

  const baseUrl = req.hostname === 'localhost' ? 'http://localhost:3000/' : 'https://covidactnow.org/';
  const url = `${baseUrl}internal/share-image/${sharePath}?snapshot=${snapshotId}`;

  console.log(`Generating screenshot for ${url}`);
  takeScreenshot(url).then((file: string) => {
    console.log('screenshot generated.');

    // Normally we let the CDN and the browser cache for 24hrs, but you can
    // override this with the ?no-cache query param (useful for testing or for
    // the scheduled ping that tries to keep functions warm).
    if (req.query['no-cache'] === undefined) {
      console.log('Setting cache-control header.');
      res.header('cache-control', 'public, max-age=86400');
    }

    res.sendFile(file);
  }).catch((error) => {
    // Assign a random ID so we can find the error in the logs if necessary.
    const errorId = Math.random().toString(36).substr(2, 10);
    console.error('Error', errorId, error);
    res.status(500).send(`<html>Image temporarily not available. Try again later.<br/>Error Id: ${errorId}<br />${error}</html>`);
  });
});
