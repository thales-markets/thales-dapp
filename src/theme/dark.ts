import { Colors } from './common';

export default {
    fontFamily: "'Titillium Regular' !important",
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
        primary: '',
        secondary: Colors.ORANGE,
        tertiary: '',
        quaternary: Colors.GREEN,
    },
    button: {
        background: {
            primary: Colors.GREEN,
            secondary: '',
            tertiary: '',
        },
        textColor: {
            primary: Colors.GREEN_DARK,
            secondary: '',
            tertiary: '',
            quaternary: Colors.YELLOW,
        },
        borderColor: {
            primary: '',
            secondary: '',
        },
    },
    input: {
        background: {
            primary: '',
            selection: {
                primary: '',
            },
        },
        textColor: {
            primary: Colors.WHITE,
            secondary: Colors.GRAY_LIGHT,
            tertiary: '',
            quaternary: Colors.RED,
        },
        borderColor: {
            primary: Colors.GRAY,
            secondary: '',
            focus: {
                primary: Colors.GREEN_LIGHT,
            },
            error: {
                primary: Colors.RED,
            },
        },
    },
};
