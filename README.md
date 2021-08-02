# Thales

A dApp enabling binary options trading — powered by the Synthetix protocol.

The trading UI is available on [thales.market](https://thales.market).

## Tech stack

-   React
-   React Redux
-   React Query
-   React Grid Layout
-   Styled-Components
-   Material-UI

## Ethereum stack

-   ethers.js v5 - Ethereum wallet implementation.
-   Blocknative Onboard - for ethereum wallet connectivity.
-   [@synthetixio/contracts-interface](https://github.com/Synthetixio/js-monorepo/tree/master/packages/contracts-interface) - for interactions with the Synthetix protocol.
-   [0x](https://github.com/0xProject/protocol) - for interactions with the 0x protocol.
-   [thales-data](https://github.com/thales-markets/thales-data) - for historical data (powered by [TheGraph](https://thegraph.com/))

## Development

### Install dependencies

```bash
npm i
```

### Set up environment variables

Copy the `.env.local.example` file in this directory to `.env.local` (which will be ignored by Git):
Then, open `.env.local` and add the missing environment variables:

-   `REACT_APP_INFURA_PROJECT_ID` - Infura project id (get it from [infura.io](https://infura.io/)).
-   `REACT_APP_PORTIS_APP_ID` - Portis app id (get it from [portis.io](https://www.portis.io/)).
-   `REACT_APP_MAINTENANCE_MODE` - Is dApp in maintenance mode. Set to `false`.
-   `REACT_APP_THALES_API_URL` - The Thales API URL. Set to `https://api.thales.market`.

### Run

```bash
npm run start
```

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### Build

```bash
npm run build
```

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!
