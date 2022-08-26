import React from 'react';
import styled from 'styled-components';
import Info from './Info';
import YourTransactions from './Transactions';

const LpStaking: React.FC = () => {
    return (
        <>
            {/* First row */}
            <SectionWrapper>
                <SectionContentWrapper>
                    <Info />
                </SectionContentWrapper>
            </SectionWrapper>

            {/* Second row */}
            <SectionWrapper columns={6}>
                <SectionContentWrapper></SectionContentWrapper>
            </SectionWrapper>
            <SectionWrapper columns={6}>
                <SectionContentWrapper></SectionContentWrapper>
            </SectionWrapper>

            {/* Third and Fourth row */}
            <SectionWrapper columns={6} rows={2}>
                <SectionContentWrapper></SectionContentWrapper>
            </SectionWrapper>

            {/* Third row */}
            <SectionWrapper columns={6}>
                <SectionContentWrapper></SectionContentWrapper>
            </SectionWrapper>

            {/* Fourth row */}
            <SectionWrapper columns={6}>
                <SectionContentWrapper></SectionContentWrapper>
            </SectionWrapper>

            {/* Fifth row */}
            <YourTransactions gridColumns={12} />
        </>
    );
};

const SectionWrapper = styled.section<{ columns?: number; rows?: number; border?: boolean }>`
    box-sizing: border-box;
    border-radius: 15px;
    ${(props) =>
        props.rows
            ? `
                display: grid; 
                grid-template-columns: 1fr; 
                grid-auto-rows: 1fr; 
                grid-gap: 24px;` // page GRID_GAP + borders(2 x 2px)
            : ''}
    grid-column: span ${(props) => (props.columns ? props.columns : 12)};
    grid-row: span ${(props) => (props.rows ? props.rows : 1)};
    background: ${(props) =>
        props.border ?? true
            ? 'linear-gradient(160deg, #801bf2 0%, #1BAB9C 100%)'
            : 'linear-gradient(-20deg, #1BAB9C 0%, #4B6DC5 47.77%, #801BF2 100%)'};
    padding: 2px;
`;

const SectionContentWrapper = styled.div<{ background?: boolean }>`
    display: grid;
    background: ${(props) => (props.background ?? true ? '#04045a' : 'none')};
    border-radius: 15px;
    align-items: center;
`;

export default LpStaking;
