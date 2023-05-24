import styled from 'styled-components';
import { FlexDivColumn } from 'theme/common';

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
    width: 400px;
    height: fit-content;
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
    padding: 16px;
    position: relative;
    margin-bottom: 20px;
`;
