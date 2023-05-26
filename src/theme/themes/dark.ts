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
            quaternary: Colors.RED,
        },
        borderColor: {
            primary: Colors.GRAY_LIGHT,
            secondary: Colors.GRAY,
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
        background: {
            primary: Colors.GRAY_DARK,
        },
        textColor: {
            primary: Colors.RED,
        },
        borderColor: {
            primary: Colors.RED,
        },
    },
    warning: {
        background: {
            primary: Colors.GRAY_DARK,
            secondary: Colors.GRAY,
        },
        textColor: {
            primary: Colors.ORANGE,
            secondary: Colors.ORANGE_DARK,
        },
        borderColor: {
            primary: Colors.ORANGE,
        },
    },
    info: {
        background: {
            primary: Colors.GRAY_DARK,
        },
        textColor: {
            primary: Colors.BLUE,
        },
        borderColor: {
            primary: Colors.BLUE,
        },
    },
};
