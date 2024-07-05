import { Colors } from '../common';

export default {
    fontFamily: {
        primary: "'Fira Sans' !important",
    },
    background: {
        primary: Colors.GRAY_DARK,
        secondary: Colors.GRAY,
        tertiary: Colors.GRAY_LIGHT,
        quaternary: Colors.GREEN,
    },
    textColor: {
        primary: Colors.WHITE,
        secondary: Colors.GRAY_LIGHT,
        tertiary: Colors.RED,
        quaternary: Colors.GREEN,
    },
    borderColor: {
        primary: Colors.GRAY,
        secondary: Colors.GRAY_LIGHT,
        tertiary: Colors.ORANGE,
        quaternary: Colors.GREEN,
    },
    button: {
        background: {
            primary: Colors.GREEN,
            secondary: Colors.GRAY_DARK,
            tertiary: Colors.GRAY,
            quaternary: Colors.GRAY_LIGHT,
        },
        textColor: {
            primary: Colors.GRAY_DARK,
            secondary: Colors.WHITE,
            tertiary: Colors.GRAY_LIGHT,
            quaternary: Colors.ORANGE,
        },
        borderColor: {
            primary: Colors.GREEN,
            secondary: Colors.GRAY_LIGHT,
            tertiary: Colors.GRAY,
            quaternary: Colors.GRAY_DARK,
        },
    },
    input: {
        background: {
            primary: Colors.GRAY_DARK,
            selection: {
                primary: Colors.WHITE,
            },
        },
        textColor: {
            primary: Colors.WHITE,
            secondary: Colors.GRAY_LIGHT,
            tertiary: Colors.GRAY,
        },
        borderColor: {
            primary: Colors.GRAY_LIGHT,
            focus: {
                primary: Colors.GREEN,
            },
            error: {
                primary: Colors.RED,
            },
        },
    },
    link: {
        textColor: {
            primary: Colors.GREEN,
            secondary: Colors.WHITE,
        },
    },
    error: {
        textColor: {
            primary: Colors.RED,
        },
    },
    warning: {
        textColor: {
            primary: Colors.ORANGE,
            secondary: Colors.ORANGE_DARK,
        },
    },
    info: {
        textColor: {
            primary: Colors.BLUE,
        },
    },
    table: {
        textColor: {
            primary: Colors.WHITE,
            secondary: Colors.GRAY_DARK,
            tertiary: Colors.ORANGE,
            quaternary: Colors.GREEN,
        },
    },
    positionColor: {
        up: Colors.GREEN,
        down: Colors.RED,
        in: Colors.GREEN_LIGHT,
        out: Colors.PURPLE,
    },
    tradeTypeColor: {
        buy: Colors.GREEN,
        sell: Colors.RED,
    },
    landingPage: {
        background: {
            primary: Colors.BLUE_MIDNIGHT,
            secondary: Colors.BLUE_MIDNIGHT_LIGHT,
        },
        textColor: {
            primary: Colors.WHITE,
            secondary: Colors.BLUE_SKY,
        },
    },
    toastMessages: {
        success: {
            background: {
                primary: Colors.GREEN,
                secondary: Colors.GREEN_LIGHT,
                tertiary: Colors.GREEN_DARK,
            },
        },
        info: {
            background: {
                primary: Colors.BLUE_DARK,
                secondary: Colors.BLUE_LIGHT,
                tertiary: Colors.BLUE,
            },
        },
        warning: {
            background: {
                primary: Colors.ORANGE,
                secondary: Colors.ORANGE_LIGHT,
                tertiary: Colors.ORANGE_DARK,
            },
        },
        error: {
            background: {
                primary: Colors.RED,
                secondary: Colors.RED_LIGHT,
                tertiary: Colors.RED_DARK,
            },
            textColor: {
                primary: Colors.BLACK,
            },
        },
    },
    flexCard: {
        potential: Colors.GREEN,
        resolved: Colors.YELLOW_DARK,
        text: Colors.GRAY_BLUE,
    },
    tour: {
        background: {
            primary: Colors.GRAY_SILVER,
            secondary: Colors.GRAY,
            tertiary: Colors.YELLOW_MUSTARD,
        },
        textColor: {
            primary: Colors.GRAY,
        },
        buttons: {
            background: {
                primary: Colors.GRAY_BLUE,
                secondary: Colors.YELLOW_MUSTARD,
            },
            textColor: {
                primary: Colors.WHITE,
                secondary: Colors.GRAY,
            },
        },
    },
};
