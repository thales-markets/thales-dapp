import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from 'assets/images/logo.svg';

export const Logo = styled(Link)`
    display: flex;
    flex: 1;
    &:before {
        content: ' ';
        background-image: url(${logo});
        height: 52px;
        width: 52px;
        margin-right: 20px;
    }
    font-family: Titillium Web;
    font-style: normal;
    font-weight: bold;
    font-size: 36px;
    line-height: 55px;
    color: white;
`;
