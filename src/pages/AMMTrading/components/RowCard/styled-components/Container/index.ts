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
    ColumnContainer: StyledComponent<'div', any, { leftBorder?: boolean; minWidth?: string; alignItems?: string }>;
    SubContainer: StyledComponent<'div', any> & SubContainerChildren;
    Divider: StyledComponent<'div', any>;
    Icon: StyledComponent<'i', any, { color?: string }>;
};

// @ts-ignore
const Container: StyledComponent<'div', any> & ContainerChildren = styled(CardContainer)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    padding: 20px 25px;
    width: 100%;
`;

const ChartContainer = styled.div`
    width: 100%;
    justify-content: space-around;
`;

// @ts-ignore
const SubContainer: StyledComponent<'div', any> & SubContainerChildren = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    margin: 10px 0px;
    justify-content: space-around;
`;

const ColumnContainer = styled.div<{ leftBorder?: boolean; minWidth?: string }>`
    display: flex;
    flex-direction: column;
    align-items: baseline;
    justify-content: flex-start;
    padding: 0px 25px;
    min-width: ${(_props) => (_props?.minWidth ? _props.minWidth : '')};
    ${(_props) => (_props?.leftBorder ? 'border-left: 2px solid var(--card-border-color)' : '')};
`;

const Divider = styled.div`
    border-left: 2px solid var(--card-border-color);
    border-radius: 30px;
`;

const Icon = styled.i<{ color?: string }>`
    margin: 0 5px;
    font-size: 24px;
    color: ${(_props) => (_props?.color ? _props.color : '')};
`;

const Header = styled.span`
    font-family: Titillium Regular !important;
    font-style: normal;
    color: var(--primary-color);
    font-weight: 400;
    font-size: 15px;
    margin-bottom: 8px;
`;

// @ts-ignore
const Value: StyledComponent<'span', any> & ValueChildren = styled.span<{ color?: string }>`
    font-family: Titillium Regular !important;
    font-style: normal;
    font-weight: 700;
    font-size: 25px;
    color: ${(_props) => (_props?.color ? _props.color : 'var(--primary-color)')};
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
