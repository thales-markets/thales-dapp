import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivRow, FlexDivCentered } from 'theme/common';

export const ComingSoon: React.FC = () => {
    const { t } = useTranslation();
    return (
        <>
            <Container>
                <Message>{t('common.coming-soon')}</Message>
            </Container>
        </>
    );
};

const Container = styled(FlexDivCentered)`
    height: 100%;
    margin-bottom: 20px;
`;

const Message = styled(FlexDivRow)`
    font-weight: 600;
    font-size: 20px;
    letter-spacing: 0.15px;
    color: #f6f6fe;
`;

export default ComingSoon;
