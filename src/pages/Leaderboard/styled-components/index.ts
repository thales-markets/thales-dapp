import styled from 'styled-components';
import { Image } from 'theme/common';

export const Wrapper = styled.div`
    width: auto;
    max-width: 1200px;
`;

export const WrapperForText = styled.div`
    width: auto;
    max-width: 700px;
    padding-left: 10px;
`;

export const TradingCompText = styled.p`
    font-size: 20px;
    font-family: 'Roboto' !important;
    color: var(--primary-color);
    line-height: 30px;
`;

export const FormContainer = styled.div`
    color: #64d9fe;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: auto;
    align-self: center;
    @media (max-width: 1250px) {
        display: none;
    }
`;

export const IconHolder = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

export const UserAvatar = styled(Image)<{ winner?: boolean }>`
    width: 44px;
    height: 44px;
    border-radius: 50%;
    margin: 5px 0px;
    border: ${(props) => (props.winner ? '2px solid #FFE489' : 'none')};
    filter: ${(props) => (props.winner ? 'drop-shadow(0px 0px 15px rgba(255, 232, 155, 0.7))' : 'none')};
    @media (max-width: 1024px) {
        width: 40px;
        height: 40px;
    }
`;

export const Gain = styled.p<{ color?: string }>`
    color: ${(_props) => (_props?.color ? _props.color : '')};
`;

export const CustomTableHeader = styled.div`
    display: flex;
    flex-direction: row;
`;
