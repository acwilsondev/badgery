const path = require('path');

const { createRequestHandler } = require('@remix-run/express');
const compression = require('compression');
const express = require('express');
const morgan = require('morgan');


const BUILD_DIR = path.join(process.cwd(), 'build');

const app = express();

// You may want to be more aggressive with this caching
app.use(express.static('public', { maxAge: '1h' }));

// Remix fingerprints its assets so we can cache forever
app.use(express.static('public/build', { immutable: true, maxAge: '1y' }));

app.use(compression());

// Log HTTP requests
app.use(morgan('tiny'));

// Handle Remix requests
app.all(
  '*',
  process.env.NODE_ENV === 'development'
    ? (req, res, next) => {
        // In development, purge require cache on each request for hot module replacement
        purgeRequireCache();
        
        return createRequestHandler({
          build: require(BUILD_DIR),
          mode: process.env.NODE_ENV,
        })(req, res, next);
      }
    : createRequestHandler({
        build: require(BUILD_DIR),
        mode: process.env.NODE_ENV,
      })
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  // Server started and listening on port ${port}
  if (process.env.NODE_ENV !== 'production') {
    process.stdout.write(`Express server listening on port ${port}\n`);
  }
});

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, but then you'll have to reconnect to databases/etc on each
  // restart. We prefer the DX of this, so we've included it for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}

