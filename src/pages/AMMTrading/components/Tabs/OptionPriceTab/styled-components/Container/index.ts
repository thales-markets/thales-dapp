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
    @media (max-width: 768px) {
        margin-right: 0px;
    }
`;

// @ts-ignore
const PriceContainer: StyledComponent<'div', any> & PriceChildren = styled.div<{ long?: boolean }>`
    color: ${(props) => (props?.long ? '#50CE99' : '#DE496D')};
    font-size: 25px;
    margin-top: 50px;
    @media (max-width: 768px) {
        font-size: 20px;
        margin-top: 40px;
    }
`;

const Price = styled.span`
    font-weight: 400;
`;

const Position = styled.span`
    font-weight: 700;
    text-transform: uppercase;
`;

PriceContainer.Price = Price;
PriceContainer.Position = Position;

Footer.PriceContainer = PriceContainer;

Container.Footer = Footer;

export default Container;
