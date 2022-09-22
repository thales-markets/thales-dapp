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

export const InfoWarningMessage: React.FC<InfoWarningMessageProps> = ({ message, hideIcon, fontSize, lineHeight }) => {
    return (
        <>
            <Container>
                <Message fontSize={fontSize} lineHeight={lineHeight}>
                    <FlexDiv>
                        {!hideIcon && <StyledWarningIcon />} {message}
                    </FlexDiv>
                </Message>
            </Container>
        </>
    );
};

const Container = styled.div`
    background: #fcc480;
    border: 1px solid #f7931a;
    border-radius: 5px;
    padding: 4px 10px;
`;

const Message = styled(FlexDivRow)<{ fontSize?: string; lineHeight?: string }>`
    font-weight: 500;
    font-size: ${(props) => (props.fontSize ? props.fontSize : '12px')};
    line-height: ${(props) => (props.lineHeight ? props.lineHeight : '16px')};
    color: #f55c05;
`;

export const StyledWarningIcon = styled(WarningIcon)`
    margin-right: 4px;
    min-width: 18px;
    min-height: 18px;
`;

export default InfoWarningMessage;
