import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FlexDivCentered } from '../../../../theme/common';
import NetworkSwitch from 'components/NetworkSwitch';

const MigrationInfo: React.FC = () => {
    const { t } = useTranslation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Conatiner>
            <LPStakingTitle>{t('migration.migration-message')}</LPStakingTitle>
            <FlexDivCentered>
                <NetworkSwitch />
            </FlexDivCentered>
        </Conatiner>
    );
};

const Conatiner = styled.section`
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    border-radius: 15px;
    color: #f6f6fe;
    grid-column: span 10;
    padding: 30px;
    @media (max-width: 767px) {
        padding: 5px;
    }
`;

const LPStakingTitle = styled(FlexDivCentered)`
    font-weight: 600;
    font-size: 30px;
    line-height: 60px;
    padding: 20px 60px;
    text-align: center;
    @media (max-width: 767px) {
        font-size: 16px;
        line-height: 18px;
        padding: 0 0 30px 0;
    }
`;

export default MigrationInfo;
