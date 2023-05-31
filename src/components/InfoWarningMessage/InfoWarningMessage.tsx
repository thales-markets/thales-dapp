import React from 'react';
import { ReactComponent as WarningIcon } from 'assets/images/warning-icon-orange.svg';
import styled from 'styled-components';
import { FlexDiv, FlexDivRow } from 'theme/common';

type InfoWarningMessageProps = {
    message: string | null;
    hideIcon?: boolean;
    fontSize?: string;
    lineHeight?: string;
};

const InfoWarningMessage: React.FC<InfoWarningMessageProps> = ({ message, hideIcon, fontSize, lineHeight }) => {
    return (
        <Container>
            <Message fontSize={fontSize} lineHeight={lineHeight}>
                <FlexDiv>
                    {!hideIcon && <StyledWarningIcon />} {message}
                </FlexDiv>
            </Message>
        </Container>
    );
};

const Container = styled.div`
    background: ${(props) => props.theme.warning.background.primary};
    border: 1px solid ${(props) => props.theme.warning.borderColor.primary};
    border-radius: 5px;
    padding: 4px 10px;
`;

const Message = styled(FlexDivRow)<{ fontSize?: string; lineHeight?: string }>`
    font-weight: 500;
    font-size: ${(props) => props.fontSize || '12px'};
    line-height: ${(props) => props.lineHeight || '16px'};
    color: ${(props) => props.theme.warning.textColor.primary};
`;

const StyledWarningIcon = styled(WarningIcon)`
    margin-right: 4px;
    min-width: 18px;
    min-height: 18px;
`;

export default InfoWarningMessage;
