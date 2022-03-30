import styled, { StyledComponent } from 'styled-components';
import { FlexDivRow } from 'theme/common';

type FooterChildren = {
    PriceContainer: StyledComponent<'div', any, { long?: boolean }> & PriceChildren;
};

type PriceChildren = {
    Price: StyledComponent<'span', any>;
    Position: StyledComponent<'span', any>;
};

type ContainerChildren = {
    Footer: StyledComponent<'div', any> & FooterChildren;
};

// @ts-ignore
const Container: StyledComponent<'div', any> & ContainerChildren = styled.div`
    width: 100%;
    margin-top: 50px;
    display: flex;
    flex-direction: column;
`;

// @ts-ignore
const Footer: StyledComponent<'div', any> & FooterChildren = styled(FlexDivRow)`
    margin-right: 50px;
`;

// @ts-ignore
const PriceContainer: StyledComponent<'div', any> & PriceChildren = styled.div<{ long?: boolean }>`
    color: ${(_props) => (_props?.long ? '#50CE99' : '#C3244A')};
    font-family: Roboto !important;
    font-size: 25px;
    margin-top: 50px;
`;

const Price = styled.span`
    font-weight: 400;
`;

const Position = styled.span`
    font-weight: 700;
`;

PriceContainer.Price = Price;
PriceContainer.Position = Position;

Footer.PriceContainer = PriceContainer;

Container.Footer = Footer;

export default Container;
