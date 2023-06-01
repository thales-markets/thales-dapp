import { SpaceKey } from 'constants/governance';
import ROUTES from 'constants/routes';
import { createBrowserHistory } from 'history';
import { createHashHistory } from 'history';

const ifIpfsDeployment = process.env.REACT_APP_IPFS_DEPLOYMENT === 'true';
const history = ifIpfsDeployment ? createHashHistory() : createBrowserHistory();

export const navigateTo = (path: string, replacePath = false, scrollToTop = false, state = '') => {
    if (scrollToTop) {
        window.scrollTo(0, 0);
    }
    replacePath ? history.replace(path, state) : history.push(path, state);
};

export const buildOptionsMarketLink = (marketAddress: string, position?: string) =>
    `${ifIpfsDeployment ? '#' : ''}${ROUTES.Options.Home}/${marketAddress}${position ? `?position=${position}` : ''}`;

export const buildRangeMarketLink = (marketAddress: string, position?: string) =>
    `${ifIpfsDeployment ? '#' : ''}${ROUTES.Options.RangeMarkets}/${marketAddress}${
        position ? `?position=${position}` : ''
    }`;

export const buildReferrerLink = (route: string, referralId: string) => {
    return `${ifIpfsDeployment ? '#' : ''}${route}?referrerId=${referralId}`;
};

export const buildHref = (route: string) => `${ifIpfsDeployment ? '#' : ''}${route}`;

export const navigateToOptionsMarket = (marketAddress: string, position?: string, replacePath = false) =>
    navigateTo(buildOptionsMarketLink(marketAddress, position), replacePath);

export const navigateToGovernance = (spaceKey?: SpaceKey, id?: string, replacePath = false) =>
    navigateTo(`${ROUTES.Governance.Home}/${spaceKey ? spaceKey : ''}/${id ? id : ''}`, replacePath);

export const buildVaultLink = (vaultId: string, language: string, excludeSlash = false) =>
    `${ifIpfsDeployment && !excludeSlash ? '#' : ''}${ROUTES.Options.Vaults}/${vaultId}?lang=${language}`;

export { history };
