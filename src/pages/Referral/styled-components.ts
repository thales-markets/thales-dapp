import styled from 'styled-components';
import { FlexDivColumn } from 'theme/common';

export const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    @media screen and (max-width: 520px) {
        width: 100%;
        margin-bottom: 20px;
    }
`;

export const Label = styled.span`
    font-size: 15px;
    line-height: 18px;
    color: ${(props) => props.theme.textColor.primary};
    margin-bottom: 6px;
    text-transform: uppercase;
`;

export const StatisticsWrapper = styled.div`
    border: 2px solid ${(props) => props.theme.borderColor.primary};
    padding: 16px 32px;
    border-radius: 15px;
    @media screen and (max-width: 520px) {
        width: 100%;
        margin-bottom: 20px;
    }
`;

export const KeyValue = styled.span`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

export const StatLabel = styled.span<{ color?: string }>`
    font-size: 21px;
    line-height: 25px;
    color: ${(props) => props.color || props.theme.textColor.primary};
`;

export const StatValue = styled(StatLabel)<{ color?: string }>`
    font-weight: 700;
    color: ${(props) => props.color || props.theme.textColor.primary};
    padding-left: 100px;
    text-align: right;
    @media screen and (max-width: 520px) {
        padding-left: 0px;
    }
`;

export const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    width: 100%;
    margin-bottom: 31px;
    @media screen and (max-width: 520px) {
        justify-content: center;
        margin-bottom: 0;
    }
`;

export const DescriptionContainer = styled.div`
    color: ${(props) => props.theme.textColor.primary};
    display: block;
    width: 40%;
    @media screen and (max-width: 520px) {
        width: 100%;
        margin-bottom: 20px;
    }
`;

export const Text = styled.p<{ height?: string }>`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 16px;
    line-height: 18px;
    height: ${(props) => props.height || ''};
    transition: height 0.3s ease-out;
    overflow: hidden;
`;

export const TableWrapper = styled(FlexDivColumn)`
    width: 100%;
    align-items: center;
    margin-bottom: 100px;
    @media (max-width: 768px) {
        margin-bottom: 10px;
    }
`;

export const RowContrainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 7px 0;
`;
