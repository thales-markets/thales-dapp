import styled from 'styled-components';

export const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

export const Label = styled.span`
    font-size: 21px;
    line-height: 31px;
    color: var(--primary-color);
`;

export const StatisticsWrapper = styled.div`
    border: 1.73987px solid var(--input-border-color);
    padding: 16px 32px;
    border-radius: 13.049px;
`;

export const KeyValue = styled.span`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

export const StatLabel = styled.span`
    font-size: 21px;
    line-height: 26.53px;
    color: var(--primary-color);
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
    width: 100%;
    max-width: 1200px;
`;

export const DescriptionContainer = styled.div`
    color: var(--primary-color);
    display: block;
    width: 40%;
`;

export const Text = styled.p`
    color: var(--primary-color);
    font-size: 16px;
    line-height: 150%;
`;

export const TableWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;
