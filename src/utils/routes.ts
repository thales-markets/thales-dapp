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

export const buildOptionsMarketLink = (marketAddress: string, option?: string) =>
    `${ifIpfsDeployment ? '#' : ''}${ROUTES.Options.Home}/${marketAddress}${option ? `?option=${option}` : ''}`;

export const buildHref = (route: string) => `${ifIpfsDeployment ? '#' : ''}${route}`;

export const navigateToOptionsMarket = (marketAddress: string, option?: string, replacePath = false) =>
    navigateTo(buildOptionsMarketLink(marketAddress, option), replacePath);

export { history };
