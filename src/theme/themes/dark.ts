import { Colors } from '../common';

export default {
    fontFamily: {
        primary: "'Titillium Regular' !important",
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
        primary: Colors.GRAY_LIGHT,
        secondary: Colors.ORANGE,
        tertiary: Colors.GRAY,
        quaternary: Colors.GREEN,
    },
    button: {
        background: {
            primary: Colors.GREEN,
            secondary: '',
            tertiary: '',
        },
        textColor: {
            primary: Colors.BLACK_LIGHT,
            secondary: '',
            tertiary: '',
            quaternary: Colors.ORANGE,
        },
        borderColor: {
            primary: Colors.GREEN,
            secondary: '',
        },
    },
    input: {
        background: {
            primary: '',
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
            primary: Colors.GRAY,
            secondary: '',
            focus: {
                primary: Colors.GREEN,
            },
            error: {
                primary: Colors.RED,
            },
        },
    },
};
