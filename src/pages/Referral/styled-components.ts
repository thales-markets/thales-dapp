import styled from 'styled-components';

export const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    @media screen and (max-width: 520px) {
        width: 100%;
        margin-bottom: 20px;
    }
`;

export const Label = styled.span`
    font-size: 21px;
    line-height: 21px;
    color: var(--primary-color);
`;

export const StatisticsWrapper = styled.div`
    border: 1.73987px solid var(--input-border-color);
    padding: 16px 32px;
    border-radius: 13.049px;
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
    line-height: 26.53px;
    color: ${(_props) => (_props?.color ? _props.color : 'var(--primary-color)')};
`;

export const StatValue = styled(StatLabel)<{ customColor?: string }>`
    font-weight: 700;
    color: ${(_props) => (_props?.color ? _props.color : 'var(--primary-color)')};
    margin-left: 100px;
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
    }
`;

export const DescriptionContainer = styled.div`
    color: var(--primary-color);
    display: block;
    width: 40%;
    @media screen and (max-width: 520px) {
        width: 100%;
        margin-bottom: 20px;
    }
`;

export const Text = styled.p<{ height?: string }>`
    color: var(--primary-color);
    font-size: 16px;
    font-weight: 100 !important;
    line-height: 150%;
    height: ${(_props) => (_props?.height ? _props.height : '')};
    transition: height 0.3s ease-out;
    overflow: hidden;
`;

export const TableWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;

export const RowContrainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 10px;
`;
