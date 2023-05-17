import styled from 'styled-components';
import dropDown from 'assets/images/drop-down-white.svg';

export const Container = styled.div`
    height: 51px;
    border: 1px solid var(--card-border-color);
    border-radius: 10px;
    position: relative;
    margin-bottom: 8px;
`;

export const Title = styled.span`
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
    padding-left: 13px;
    padding-top: 5px;
    text-transform: uppercase;
    color: var(--table-header-text-color);
`;

export const OptionsContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #e9e9e9;
    border: 1px solid var(--input-border-color);
    box-shadow: var(--shadow);
    border-radius: 10px;
    z-index: 1;
`;

export const Option = styled.div`
    padding: 7px 14px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    :first-child {
        margin-top: 18px;
    }
    :last-child {
        margin-bottom: 18px;
    }
    :hover {
        background-color: var(--table-header-text-color);
    }
`;

export const OptionTitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    font-size: 20.5px;
    font-weight: 600;
    line-height: 200%;
    align-items: center;
`;

export const OptionSubValueContainer = styled.span`
    display: flex;
    flex-direction: row;
    font-size: 20.5px;
    font-weight: 600;
    line-height: 200%;
    align-items: center;
`;

export const ValueContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding-left: 13px;
`;

export const Value = styled.span`
    font-size: 20px;
    font-weight: 600;
    line-height: 31px;
    color: var(--color-white);
`;

export const Arrow = styled.i<{ color?: string }>`
    content: url(${dropDown});
    color: ${(_props) => (_props?.color ? _props.color : 'var(--color-white)')};
    font-size: 18px;
    cursor: pointer;
`;
