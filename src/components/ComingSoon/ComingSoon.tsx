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
    min-height: 300px;
    height: 100%;
    margin-bottom: 20px;
    grid-column: span 10;
    @media (max-width: 767px) {
        background: var(--color-primary);
        border-radius: 15px;
    }
`;

const Message = styled(FlexDivRow)`
    font-weight: 600;
    font-size: 32px;
    line-height: 44px;
    color: #f6f6fe;
    @media (max-width: 767px) {
        font-size: 18px;
        line-height: 18px;
    }
`;

export default ComingSoon;
