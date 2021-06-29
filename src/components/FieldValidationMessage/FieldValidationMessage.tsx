import React from 'react';
import { ReactComponent as ValidationErrorIcon } from 'assets/images/validation-error-circle.svg';
import styled from 'styled-components';
import { FlexDiv } from 'theme/common';

type FieldValidationMessageProps = {
    showValidation: boolean;
    message: string;
    arrowPosition?: string;
    marginLeft?: string;
};

export const FieldValidationMessage: React.FC<FieldValidationMessageProps> = ({
    showValidation,
    message,
    marginLeft,
    arrowPosition = 'left',
}) => {
    return (
        <>
            {showValidation && (
                <Container marginLeft={marginLeft}>
                    <Message arrowPosition={arrowPosition}>
                        <StyledValidationErrorIcon /> {message}
                    </Message>
                </Container>
            )}
        </>
    );
};

const Container = styled.div<{ marginLeft?: string }>`
    position: relative;
    margin-left: ${(props) => props.marginLeft || '0px'};
`;

const Message = styled(FlexDiv)<{ arrowPosition: string }>`
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
        left: ${(props) => (props.arrowPosition === 'left' ? '15%' : '85%')};
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
