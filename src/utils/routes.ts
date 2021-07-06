import ROUTES from 'constants/routes';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

export const navigateTo = (path: string, replacePath = false, scrollToTop = false, state = '') => {
    if (scrollToTop) {
        window.scrollTo(0, 0);
    }
    replacePath ? history.replace(path, state) : history.push(path, state);
};

export const buildOptionsMarketLink = (marketAddress: string) => `${ROUTES.Options.Home}/${marketAddress}`;

export const navigateToOptionsMarket = (marketAddress: string, replacePath = false) =>
    navigateTo(buildOptionsMarketLink(marketAddress), replacePath);

export { history };
