import React from 'react';
import { ReactComponent as InfoIcon } from 'assets/images/info-circle-blue.svg';
import styled from 'styled-components';
import { FlexDiv, FlexDivRow } from 'theme/common';

type InfoMessageProps = {
    message: string | null;
    hideIcon?: boolean;
    fontSize?: string;
    lineHeight?: string;
};

export const InfoMessage: React.FC<InfoMessageProps> = ({ message, hideIcon, fontSize, lineHeight }) => {
    return (
        <>
            <Container>
                <Message fontSize={fontSize} lineHeight={lineHeight}>
                    <FlexDiv>
                        {!hideIcon && <StyledInfoIIcon />} {message}
                    </FlexDiv>
                </Message>
            </Container>
        </>
    );
};

const Container = styled.div`
    background: #79a8d0;
    border: 1px solid #64d9fe;
    border-radius: 5px;
    padding: 4px 10px;
`;

const Message = styled(FlexDivRow)<{ fontSize?: string; lineHeight?: string }>`
    font-weight: 500;
    font-size: ${(props) => props.fontSize || '12px'};
    line-height: ${(props) => props.lineHeight || '16px'};
    color: #04045a;
`;

export const StyledInfoIIcon = styled(InfoIcon)`
    margin-right: 6px;
    min-width: 14px;
    min-height: 14px;
`;

export default InfoMessage;
