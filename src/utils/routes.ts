import ROUTES from 'constants/routes';
import { createHashHistory } from 'history';

// TODO try with browser history
const history = createHashHistory();

export const navigateTo = (path: string, replacePath = false, scrollToTop = false) => {
    if (scrollToTop) {
        window.scrollTo(0, 0);
    }
    replacePath ? history.replace(path) : history.push(path);
};

export const buildOptionsMarketLink = (marketAddress: string) => `${ROUTES.Options.Home}/${marketAddress}`;

export const navigateToOptionsMarket = (marketAddress: string, replacePath = false) =>
    navigateTo(buildOptionsMarketLink(marketAddress), replacePath);
