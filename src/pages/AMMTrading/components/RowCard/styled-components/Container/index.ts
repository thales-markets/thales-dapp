import styled, { StyledComponent } from 'styled-components';
import { CardContainer } from 'theme/common';

type ValueChildren = {
    Liquidity: StyledComponent<'span', any, { shortLiqFlag?: boolean }>;
};

type SubContainerChildren = {
    Header: StyledComponent<'span', any>;
    Value: StyledComponent<'span', any> & ValueChildren;
};

type ContainerChildren = {
    ChartContainer: StyledComponent<'div', any>;
    SubContainer: StyledComponent<'div', any> & SubContainerChildren;
    Divider: StyledComponent<'div', any>;
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
    width: 130px;
    margin-left: 22px;
`;

// @ts-ignore
const SubContainer: StyledComponent<'div', any> & SubContainerChildren = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    margin: 0px 25px;
`;

const Divider = styled.div`
    border-left: 2px solid var(--input-border-color);
    border-radius: 30px;
    height: 51px;
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
const Value: StyledComponent<'span', any> & ValueChildren = styled.span`
    font-family: Titillium Regular !important;
    font-style: normal;
    font-weight: 700;
    font-size: 25px;
    color: var(--primary-color);
`;

const Liquidity = styled.span<{ shortLiqFlag?: boolean }>`
    color: ${(_props) => (_props?.shortLiqFlag ? '#C3244A' : '#50CE99')};
`;

Value.Liquidity = Liquidity;

SubContainer.Header = Header;
SubContainer.Value = Value;

Container.ChartContainer = ChartContainer;
Container.Divider = Divider;
Container.SubContainer = SubContainer;

export default Container;
