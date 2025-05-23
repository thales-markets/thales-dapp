import ROUTES from 'constants/routes';
import { createBrowserHistory, createHashHistory } from 'history';

const ifIpfsDeployment = process.env.REACT_APP_IPFS_DEPLOYMENT === 'true';
const history = ifIpfsDeployment ? createHashHistory() : createBrowserHistory();

export const navigateTo = (path: string, replacePath = false, scrollToTop = false, state = '') => {
    if (scrollToTop) {
        window.scrollTo(0, 0);
    }
    replacePath ? history.replace(path, state) : history.push(path, state);
};

export const buildOptionsMarketLink = (marketAddress: string, isDeprecated: boolean, position?: string) => {
    return `${ifIpfsDeployment ? '#' : ''}${ROUTES.Options.Home}/${marketAddress}?isDeprecated=${isDeprecated}${
        position ? `&position=${position}` : ''
    }`;
};

export const buildRangeMarketLink = (marketAddress: string, isDeprecated: boolean, position?: string) =>
    `${ifIpfsDeployment ? '#' : ''}${ROUTES.Options.RangeMarkets}/${marketAddress}?isDeprecated=${isDeprecated}${
        position ? `&position=${position}` : ''
    }`;

export const buildHref = (route: string) => `${ifIpfsDeployment ? '#' : ''}${route}`;

export const navigateToOptionsMarket = (
    marketAddress: string,
    isDeprecated: boolean,
    position?: string,
    replacePath = false
) => navigateTo(buildOptionsMarketLink(marketAddress, isDeprecated, position), replacePath);

export const buildVaultLink = (vaultId: string, excludeSlash = false) =>
    `${ifIpfsDeployment && !excludeSlash ? '#' : ''}${ROUTES.Options.Vaults}/${vaultId}`;

export const buildLiquidityPoolLink = (excludeSlash = false) =>
    `${ifIpfsDeployment && !excludeSlash ? '#' : ''}${ROUTES.Options.LiquidityPool}`;

export { history };
