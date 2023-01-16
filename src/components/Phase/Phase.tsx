import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Phase } from 'types/options';

const MarketPhase = {
    trading: '#50CE99',
    paused: '#C3244A',
    maturity: '#F7B91A',
};

const PhaseComponent: React.FC<{ phase: Phase }> = ({ phase }) => {
    const { t } = useTranslation();

    return (
        <PhaseComp phase={phase}>
            {t('options.phases.' + phase)} <Dot phase={phase} />
        </PhaseComp>
    );
};

const PhaseComp = styled.span<{ phase: Phase }>`
    color: ${(props: any) => (MarketPhase as any)[props.phase]};
    text-transform: capitalize;
    font-weight: 300;
`;

const Dot = styled.span<{ phase: Phase }>`
    height: 7px;
    width: 7px;
    background-color: ${(props: any) => (MarketPhase as any)[props.phase]};
    border-radius: 50%;
    display: inline-block;
    vertical-align: middle;
`;

export default PhaseComponent;
