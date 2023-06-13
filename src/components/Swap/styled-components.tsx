import styled from 'styled-components';
import { FlexDivColumn } from 'styles/common';

export const Container = styled.div<{ contentType?: string }>`
    font-weight: bold;
    font-size: 12px;
    line-height: 24px;
    min-width: 70px;
    background: ${(props) => props.theme.background.primary};
    margin: auto;
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 400px;
    height: 100%;
    opacity: ${(props) => (props.contentType === 'loading' ? '0.85' : '')};
    @media screen and (max-width: 500px) {
        width: 325px;
    }
`;

export const ErrorMessage = styled.p`
    font-size: 18px;
    height: 60px;
    display: flex;
    align-self: center;
    align-items: center;
    font-weight: bold;
    color: ${(props) => props.theme.textColor.primary};
`;

export const SectionWrapper = styled(FlexDivColumn)`
    background: ${(props) => props.theme.background.primary};
    position: relative;
    margin: 10px;
`;

export const LoaderContainer = styled.div`
    display: grid;
    grid-auto-flow: row;
    grid-gap: 10px;
    align-items: center;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`;

export const defaultButtonProps = {
    margin: '10px',
};
