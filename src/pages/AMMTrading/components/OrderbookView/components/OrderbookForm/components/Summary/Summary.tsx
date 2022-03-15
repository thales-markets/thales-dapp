import React from 'react';
import styled from 'styled-components';

type SummaryPropsType = {
    title?: string;
    items: Array<SummaryItemType>;
    displayUpDownBorder?: boolean;
    margin?: string;
};

type SummaryItemType = {
    title: string | number;
    value?: string | number;
    textColor?: string;
    fontSize?: string;
};

const Summary: React.FC<SummaryPropsType> = ({ title, items, displayUpDownBorder, margin }) => {
    return (
        <Wrapper displayUpDownBorder={displayUpDownBorder} margin={margin}>
            {title && <Title>{title}</Title>}
            {items?.length &&
                items.map((item, index) => {
                    return (
                        <Row key={index} color={item?.textColor} fontSize={item?.fontSize}>
                            <SubTitle>{item.title}</SubTitle>
                            <SubValue>{item.value}</SubValue>
                        </Row>
                    );
                })}
        </Wrapper>
    );
};

const Wrapper = styled.div<{ displayUpDownBorder?: boolean; margin?: string }>`
    display: flex;
    flex-direction: column;
    width: 100%;
    ${(_props) => (_props?.displayUpDownBorder ? 'border-top: 1px solid var(--primary-color)' : '')}
    ${(_props) => (_props?.displayUpDownBorder ? 'border-bottom: 1px solid var(--primary-color)' : '')}
    ${(_props) => (_props?.margin ? `margin: ${_props.margin}` : '')}
`;

const Row = styled.div<{ color?: string; fontSize?: string }>`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    text-transform: uppercase;
    font-family: Titillium Regular !important;
    font-size: ${(_props) => (_props?.fontSize ? _props.fontSize : '12px')};
    line-height: 110%;
    color: ${(_props) => (_props?.color ? _props.color : 'var(--primary-color)')};
`;

const Title = styled.span`
    font-size: 15px;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 17px;
`;

const SubTitle = styled.span`
    font-weight: 400;
`;

const SubValue = styled.span`
    font-weight: 400;
`;

export default Summary;
