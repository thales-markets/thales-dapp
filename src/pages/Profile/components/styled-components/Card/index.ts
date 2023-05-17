import styled, { StyledComponent } from 'styled-components';

type Children = {
    Wrapper: any;
    Column: StyledComponent<
        'div',
        any,
        {
            ranged?: boolean | undefined;
        },
        never
    >;
    Row: StyledComponent<'div', any>;
    RowTitle: StyledComponent<'span', any>;
    RowSubtitle: StyledComponent<'span', any>;
    Section: StyledComponent<'div', any>;
};

type WrapperProps = {
    background?: boolean;
};

const CardWrapper = styled.div<WrapperProps>`
    background: ${(_props) =>
        _props.background ? 'linear-gradient(rgba(130, 8, 252, 1), rgba(81, 106, 255, 1))' : 'transparent'};
    margin-bottom: 15px;
    border-radius: 15px;
    box-shadow: ${(_props) => (_props.background ? ' 0px 0px 40px 3px rgba(100, 217, 254, 0.3)' : 'none')};
    padding: 2px;
    border: ${(_props) => (_props.background ? 'none' : '2px solid rgba(100, 217, 254, 0.5)')};
    &:hover {
        transform: scale(1.02);
        border: ${(_props) => (_props.background ? 'none' : '2px solid rgba(100, 217, 254, 1)')};
        box-shadow: ${(_props) => (_props.background ? ' 0px 0px 40px 3px rgba(100, 217, 254, 0.6)' : 'none')};
    }
`;

// @ts-ignore
const Card: StyledComponent<'div', any> & Children = styled.div`
    background: var(--background);
    box-sizing: border-box;
    border-radius: 15px;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    @media (max-width: 380px) {
        padding: 16px 10px;
    }
`;
const CardColumn = styled.div<{ ranged?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    height: 100%;
    flex: ${(_props) => (_props.ranged ? 'none' : '2')};
`;

const CardRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    & > svg {
        width: 36px !important;
        height: 36px !important;
    }

    @media (max-width: 500px) {
        & > svg {
            width: 26px !important;
            height: 26px !important;
            margin-bottom: 4px;
        }
    }
`;

const CardText = styled.span`
    display: block;
    font-family: Roboto !important;
    color: var(--color-white);
    line-height: 100%;
    white-space: pre;
`;

const SectionContainer = styled.div`
    display: block;
    &:not(:last-child) {
        margin-bottom: 10px;
    }
    @media (max-width: 500px) {
        & > svg {
            width: 32px !important;
            height: 32px !important;
            margin-bottom: 4px;
        }
    }
`;

const Header = styled(CardText)`
    font-size: 14px;
    font-weight: 400;
    text-transform: capitalize;
    margin-bottom: 4px;
    @media (max-width: 500px) {
        font-size: 8px;
    }
`;

const SubHeader = styled(CardText)`
    font-size: 23px;
    span {
        font-size: 23px !important;
        white-space: pre;
    }
    font-weight: 700;
    @media (max-width: 500px) {
        font-size: 14px;
        span {
            font-size: 14px !important;
        }
    }

    @media (max-width: 400px) {
        font-size: 12px;
        span {
            font-size: 12px !important;
        }
    }
`;

Card.Wrapper = CardWrapper;
Card.Column = CardColumn;
Card.Section = SectionContainer;
Card.Row = CardRow;
Card.RowTitle = Header;
Card.RowSubtitle = SubHeader;

export default Card;
