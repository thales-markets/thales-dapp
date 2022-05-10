import styled from 'styled-components';

export const Wrapper = styled.div<{ maxWidth?: string; margin?: string }>`
    display: flex;
    flex-direction: column;
    max-width: ${(_props) => (_props?.maxWidth ? _props?.maxWidth : '390px')};
    min-width: 360px;
    border: 2px solid rgba(100, 217, 254, 0.5);
    box-sizing: border-box;
    border-radius: 15px;
    padding: 20px;
    margin: ${(_props) => (_props?.margin ? _props.margin : '7.5px')};
    flex: 1;
    :hover {
        transform: scale(1.02);
        border: 2px solid rgb(100, 217, 254, 1);
    }
    cursor: pointer;
    @media (max-width: 768px) {
        min-width: 100%;
    }
`;

export const CardFooter = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: -30px;
`;

export const MiddleContrainer = styled.div`
    display: flex;
    width: 100%;
    margin-top: -10px;
`;

export const CardHeader = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
`;

export const HeaderContainer = styled.div`
    display: flex;
    flex-direction: column;
`;
