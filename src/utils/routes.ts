import ROUTES from 'constants/routes';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

export const navigateTo = (path: string, replacePath = false, scrollToTop = false, state = '') => {
    if (scrollToTop) {
        window.scrollTo(0, 0);
    }
    replacePath ? history.replace(path, state) : history.push(path, state);
};

export const buildOptionsMarketLink = (marketAddress: string, option?: string) =>
    `${ROUTES.Options.Home}/${marketAddress}${option ? `?option=${option}` : ''}`;

export const navigateToOptionsMarket = (marketAddress: string, option?: string, replacePath = false) =>
    navigateTo(buildOptionsMarketLink(marketAddress, option), replacePath);

export { history };
