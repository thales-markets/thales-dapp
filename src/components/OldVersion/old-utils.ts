import basketball from 'assets/images/basketball.svg';
import burn from 'assets/images/burn.png';
import volleyball from 'assets/images/volleyball.svg';
import flippening from 'assets/images/flippening.png';
import xyz from 'assets/images/xyz.png';
import tennis from 'assets/images/tennis.svg';
import medals from 'assets/images/medals.png';

export const countryToCountryCode = (country: string) => {
    if (country) {
        switch (country) {
            case 'USA':
                return 'US';
            case 'JPN':
                return 'JP';
            case 'CHN':
                return 'CN';
            case 'RUS':
                return 'RU';
            case 'SRB':
                return 'RS';
            case 'AUS':
                return 'AU';
            case 'SLO':
                return 'SI';
            case 'POL':
                return 'PL';
            case 'ESP':
                return 'ES';
        }
    }
};

export const eventToIcon = (event: string) => {
    if (event) {
        if (event.toLowerCase().indexOf('basketball') !== -1) {
            return basketball;
        }
        if (event.toLowerCase().indexOf('volleyball') !== -1) {
            return volleyball;
        }
        if (event.toLowerCase().indexOf('medals') !== -1) {
            return medals;
        }
        if (event.toLowerCase().indexOf('tennis') !== -1 || event.toLowerCase().indexOf('us open') !== -1) {
            return tennis;
        }
        if (event.toLowerCase().indexOf('xyz') !== -1) {
            return xyz;
        }
        if (
            event.toLowerCase().indexOf('flippening markets') !== -1 ||
            event.toLowerCase().indexOf('market cap ratio') !== -1
        ) {
            return flippening;
        }
        if (event.toLowerCase().indexOf('eth burned count') !== -1) {
            return burn;
        }
    }
};
