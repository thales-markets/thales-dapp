import React from 'react';
import { ReactComponent as ValidationErrorIcon } from 'assets/images/validation-error-triangle.svg';
import { ReactComponent as CloseIcon } from 'assets/images/close-red.svg';
import styled from 'styled-components';
import { FlexDiv, FlexDivRow } from 'styles/common';

type ValidationMessageProps = {
    showValidation: boolean;
    message: string | null;
    onDismiss: () => void;
};

const ValidationMessage: React.FC<ValidationMessageProps> = ({ showValidation, message, onDismiss }) => {
    return (
        <>
            {showValidation && (
                <Container>
                    <Message>
                        <FlexDiv>
                            <StyledValidationErrorIcon /> {message}
                        </FlexDiv>
                        <CloseIconContainer onClick={onDismiss} />
                    </Message>
                </Container>
            )}
        </>
    );
};

const Container = styled.div`
    position: relative;
    margin-top: 15px;
`;

const Message = styled(FlexDivRow)`
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.5px;
    color: ${(props) => props.theme.error.textColor.primary};
    border: 1px solid ${(props) => props.theme.error.borderColor.primary};
    box-sizing: border-box;
    border-radius: 5px;
    padding: 5px 10px;
`;

const StyledValidationErrorIcon = styled(ValidationErrorIcon)`
    margin-right: 8px;
    min-width: 18px;
    min-height: 16px;
`;

const CloseIconContainer = styled(CloseIcon)`
    min-width: 10px;
    min-height: 10px;
    margin-top: 3px;
    margin-left: 5px;
    :hover {
        cursor: pointer;
    }
`;

export default ValidationMessage;
