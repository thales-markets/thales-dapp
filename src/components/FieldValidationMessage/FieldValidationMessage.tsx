import React from 'react';
import { ReactComponent as ValidationErrorIcon } from 'assets/images/validation-error-circle.svg';
import styled from 'styled-components';
import { FlexDiv } from 'theme/common';

type FieldValidationMessageProps = {
    showValidation: boolean;
    message: string;
};

export const FieldValidationMessage: React.FC<FieldValidationMessageProps> = ({ showValidation, message }) => {
    return (
        <>
            {showValidation && (
                <Container>
                    <Message>
                        <StyledValidationErrorIcon /> {message}
                    </Message>
                </Container>
            )}
        </>
    );
};

const Container = styled.div`
    position: relative;
`;

const Message = styled(FlexDiv)`
    align-items: center;
    background: #e9bcbc;
    border-radius: 5px;
    font-style: normal;
    font-weight: normal;
    font-size: 10px;
    line-height: 16px;
    letter-spacing: 0.25px;
    color: #e53720;
    margin: 5px 2px 0 2px;
    padding: 2px 6px;
    :before {
        content: '';
        position: absolute;
        top: -7px;
        left: 15%;
        border-width: 7px;
        border-style: solid;
        border-color: transparent transparent #e9bcbc transparent;
    }
`;

export const StyledValidationErrorIcon = styled(ValidationErrorIcon)`
    margin-right: 4px;
    min-width: 12px;
    min-height: 12px;
`;

export default FieldValidationMessage;
