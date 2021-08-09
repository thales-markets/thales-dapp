import React from 'react';
import { ReactComponent as WarningIcon } from 'assets/images/warning-icon.svg';
import styled from 'styled-components';
import { FlexDiv, FlexDivRow } from 'theme/common';

type WarningMessageProps = {
    message: string | null;
};

export const WarningMessage: React.FC<WarningMessageProps> = ({ message }) => {
    return (
        <>
            <Container>
                <Message>
                    <FlexDiv>
                        <StyledWarningIcon /> {message}
                    </FlexDiv>
                </Message>
            </Container>
        </>
    );
};

const Container = styled.div`
    position: relative;
`;

const Message = styled(FlexDivRow)`
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.25px;
    color: #ffcc00;
`;

export const StyledWarningIcon = styled(WarningIcon)`
    margin-right: 6px;
    min-width: 14px;
    min-height: 14px;
    margin-top: 1px;
`;

export default WarningMessage;
