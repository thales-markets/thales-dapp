import styled from 'styled-components';
import { MarketCardContainer } from 'theme/common';

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
    }
`;

const SectionContainer = styled.div`
    display: block;
    margin-bottom: 15px;
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
    font-size: 20px;
    font-weight: 300;
    text-transform: capitalize;
`;

const SubHeader = styled(CardText)`
    font-size: 25px;
    font-weight: 400;
`;

const Percentage = styled(CardText)`
    font-size: 25px;
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

const StyledComponents = {
    Card,
    SectionContainer,
    AssetInfo,
    CardText,
    Header,
    SubHeader,
    Percentage,
    AssetNameContainer,
};

export default StyledComponents;
