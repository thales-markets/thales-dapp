import styled from 'styled-components';
import { CardContainer } from 'theme/common';

export const Container = styled(CardContainer)`
    display: flex;
    flex-direction: column;
    padding: 20px 30px;
    margin-right: 20px;
    width: 50%;
    @media (max-width: 568px) {
        width: 100%;
    }
`;

export const Header = styled.span`
    justify-self: center;
    align-self: center;
    font-weight: 600;
    font-size: 20px;
    line-height: 150%;
    margin-bottom: 60px;
    color: ${(props) => props.theme.textColor.primary};
`;

export const Label = styled.span`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 28px;
`;

export const OptionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
`;

export const Icon = styled.i<{ color?: string }>`
    margin: 0 5px;
    font-size: 24px;
    color: ${(_props) => (_props?.color ? _props.color : '')};
`;
