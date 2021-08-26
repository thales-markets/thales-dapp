import styled from 'styled-components';
import { FlexDivRowCentered, FlexDiv, FlexDivColumn, FlexDivColumnCentered, FlexDivRow } from 'theme/common';

export const EarnSection = styled.section`
    padding-bottom: 0px;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    background: #04045a;
    border-radius: 23px;
    overflow: hidden;
    color: white;
    grid-column: span 5;
    margin-bottom: 15px;
`;

export const SectionHeader = styled(FlexDivRowCentered)`
    font-weight: 600;
    font-size: 20px;
    letter-spacing: 0.15px;
    color: #f6f6fe;
    min-height: 50px;
    border-bottom: 1px solid rgba(228, 228, 228, 0.1);
    padding: 0px 20px 0 30px;
`;

export const SectionContent = styled(FlexDiv)`
    padding: 30px 30px 15px 30px;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
`;

export const ClaimDiv = styled(FlexDiv)`
    align-items: center;
`;

export const ClaimTitle = styled.span`
    font-size: 18px;
    padding-right: 5px;
`;

export const ClaimContent = styled.span`
    font-size: 16px;
`;

export const SectionContentContainer = styled(FlexDivColumn)`
    padding: 40px 30px 35px 30px;
`;

export const ClaimItem = styled(FlexDivRow)`
    margin-bottom: 20px;
`;

export const ButtonContainer = styled(FlexDivColumnCentered)`
    margin-top: 40px;
    align-items: center;
`;

export const ClaimMessage = styled.div`
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.25px;
    color: #ffcc00;
    margin-top: 10px;
`;
