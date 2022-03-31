import styled, { StyledComponent } from 'styled-components';
import { CardContainer } from 'theme/common';

type ValueChildren = {
    Liquidity: StyledComponent<'span', any, { shortLiqFlag?: boolean }>;
};

type SubContainerChildren = {
    Header: StyledComponent<'span', any>;
    Value: StyledComponent<'span', any, { color?: string }> & ValueChildren;
};

type ContainerChildren = {
    ChartContainer: StyledComponent<'div', any>;
    ColumnContainer: StyledComponent<
        'div',
        any,
        { leftBorder?: boolean; minWidth?: string; alignItems?: string; currency?: boolean; priceChart?: boolean }
    >;
    SubContainer: StyledComponent<'div', any, { hidden?: boolean }> & SubContainerChildren;
    Divider: StyledComponent<'div', any>;
    Icon: StyledComponent<'i', any, { color?: string }>;
};

// @ts-ignore
const Container: StyledComponent<'div', any> & ContainerChildren = styled(CardContainer)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    padding: 5px 25px;
    gap: 10px;
    width: 100%;
    flex-wrap: wrap;
    @media (max-width: 568px) {
        gap: 0;
        padding: 20px 10px;
        display: grid;
        grid-template-rows: 1fr 1fr 1fr;
        grid-template-columns: 1fr 1fr;
    }
`;

const ChartContainer = styled.div`
    width: 100%;
    justify-content: space-around;
`;

// @ts-ignore
const SubContainer: StyledComponent<'div', any, { hidden?: boolean }> & SubContainerChildren = styled.div<{
    hidden?: boolean;
}>`
    display: flex;
    flex-direction: column;
    justify-content: start;
    margin: 10px 0px;
    visibility: ${(_props) => (_props.hidden ? 'hidden' : '')};
    justify-content: space-around;
`;

const ColumnContainer = styled.div<{
    leftBorder?: boolean;
    alignItems?: string;
    minWidth?: string;
    currency?: boolean;
    priceChart?: boolean;
}>`
    display: flex;
    flex-direction: column;
    align-items: ${(_props) => (_props?.alignItems ? _props.alignItems : 'baseline')};
    justify-content: flex-start;
    @media (max-width: 568px) {
        padding: 0 10px;
        flex: 1;
        flex-direction: ${(_props) => (_props?.currency ? 'row' : 'column')};
        align-items: ${(_props) => (_props?.currency ? 'center' : 'baseline')};
        grid-column-start: ${(_props) => _props?.priceChart && 2};
        grid-row-start: ${(_props) => _props?.priceChart && 1};
    }
    min-width: ${(_props) => (_props?.minWidth ? _props.minWidth : '')};
    ${(_props) => (_props?.leftBorder ? 'border-left: 2px solid var(--card-border-color)' : '')};
`;

const Divider = styled.div`
    width: 2px;
    opacity: 0.5;
    min-height: 115px;
    margin: 10px 0;
    background: var(--card-border-color);
    border-radius: 30px;
    @media (max-width: 568px) {
        display: none;
    }
`;

const Icon = styled.i<{ color?: string }>`
    margin: 0 5px;
    font-size: 24px;
    color: ${(_props) => (_props?.color ? _props.color : '')};
`;

const Header = styled.span`
    font-family: Roboto !important;
    font-style: normal;
    color: var(--primary-color);
    font-weight: 400;
    font-size: 15px;
    margin-bottom: 8px;
    white-space: pre;
    @media (max-width: 1024px) {
        font-size: 14px;
    }
    @media (max-width: 568px) {
        font-size: 12px;
        margin-bottom: 6px;
    }
`;

// @ts-ignore
const Value: StyledComponent<'span', any> & ValueChildren = styled.span<{ color?: string }>`
    font-family: Roboto !important;
    font-style: normal;
    font-weight: 700;
    font-size: 25px;
    white-space: pre;
    color: ${(_props) => (_props?.color ? _props.color : 'var(--primary-color)')};
    @media (max-width: 1024px) {
        font-size: 21px;
    }
    @media (max-width: 568px) {
        font-size: 18px;
    }
`;

const Liquidity = styled.span<{ shortLiqFlag?: boolean }>`
    color: ${(_props) => (_props?.shortLiqFlag ? '#C3244A' : '#50CE99')};
`;

Value.Liquidity = Liquidity;

SubContainer.Header = Header;
SubContainer.Value = Value;

Container.ChartContainer = ChartContainer;
Container.Divider = Divider;
Container.Icon = Icon;
Container.ColumnContainer = ColumnContainer;
Container.SubContainer = SubContainer;

export default Container;
