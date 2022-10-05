import styled from 'styled-components';
import { MarketCardContainer } from 'theme/common';

const Footer = styled.div`
    border-color: transparent transparent #50ce99 transparent; // #297DFC #50ce99
    border-style: solid;
    border-width: 121px 0px 120px 150px;
    height: 0px;
    width: 0px;
    position: relative;
    top: -204px;
    right: -24px;
`;

const Card = styled(MarketCardContainer)<{ address?: string }>`
    padding: 15px 20px;
    width: 195px;
    height: 320px;
    display: flex;
    border-radius: 15px;
    margin: 7.5px;
    background-color: var(--background);
    flex-direction: column;
    &:hover {
        box-shadow: var(--shadow);
        ${Footer} {
            border-color: transparent transparent #3fd1ff transparent; // #297DFC #50ce99
        }
    }
    overflow: hidden;
`;

const SectionContainer = styled.div`
    display: block;
    margin-bottom: 15px;
    position: relative;
`;

const AssetInfo = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 12px;
    margin-right: -5px;
    margin-left: -5px;
`;

const CardText = styled.span`
    display: block;
    font-family: Roboto !important;
    color: var(--primary-color);
`;

const Header = styled(CardText)`
    font-size: 16px;
    font-weight: 300;
    text-transform: capitalize;
`;

const SubHeader = styled(CardText)`
    font-size: 20px;
    font-weight: 400;
`;

const Percentage = styled(CardText)`
    font-size: 20px;
    font-weight: 700;
    color: #50ce99;
`;

const AssetNameContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: left;
    font-size: 15px;
    color: var(--primary-color) !important;
    /* word-spacing: 50px; */
`;

const DiscountDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 62px;
    left: -90px;
`;

const Discount = styled.span`
    font-weight: 700;
    font-size: 40px;
    line-height: 100%;
    text-transform: capitalize;
    color: #04045a;
`;

const DiscountText = styled.span`
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 100%;
    text-transform: capitalize;
    color: #04045a;
`;

const StyledComponents = {
    Card,
    DiscountText,
    SectionContainer,
    AssetInfo,
    CardText,
    Header,
    SubHeader,
    Percentage,
    AssetNameContainer,
    Footer,
    Discount,
    DiscountDiv,
};

export default StyledComponents;
