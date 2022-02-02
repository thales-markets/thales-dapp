import React from 'react';
import { ReactComponent as InfoIcon } from 'assets/images/info-circle-blue.svg';
import styled from 'styled-components';
import { FlexDiv, FlexDivRow } from 'theme/common';

type InfoMessageProps = {
    message: string | null;
    hideIcon?: boolean;
};

export const InfoMessage: React.FC<InfoMessageProps> = ({ message, hideIcon }) => {
    return (
        <>
            <Container>
                <Message>
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

const Message = styled(FlexDivRow)`
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: #04045a;
`;

export const StyledInfoIIcon = styled(InfoIcon)`
    margin-right: 6px;
    min-width: 14px;
    min-height: 14px;
`;

export default InfoMessage;
