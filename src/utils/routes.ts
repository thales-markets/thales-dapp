import ROUTES from 'constants/routes';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

export const navigateTo = (path: string, replacePath = false, scrollToTop = false) => {
    if (scrollToTop) {
        window.scrollTo(0, 0);
    }
    replacePath ? history.replace(path) : history.push(path);
};

export const buildOptionsMarketLink = (marketAddress: string) => `${ROUTES.Options}/${marketAddress}`;

export const navigateToOptionsMarket = (marketAddress: string, replacePath = false) =>
    navigateTo(buildOptionsMarketLink(marketAddress), replacePath);
