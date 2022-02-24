import styled, { StyledComponent } from 'styled-components';

type Children = {
    Wrapper: any;
    Row: StyledComponent<'div', any>;
    Label: StyledComponent<'span', any>;
    Value: StyledComponent<'span', any>;
};

type ValueProps = {
    color?: string;
};

// @ts-ignore
const Wrapper: StyledComponent<'div', any> & Children = styled.div`
    display: block;
    background: #04045a;
    box-sizing: border-box;
    border-radius: 15px;
    padding: 24px 50px;
    border: 2px solid rgba(100, 217, 254, 0.5);
    width: 100%;
    max-width: 500px;
    margin: 40px auto;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    max-width: 500px;
    width: 100%;
`;

const Text = styled.span`
    display: block;
    font-family: Titillium Light !important;
    color: var(--primary-color);
    font-size: 25px;
    line-height: 31px;
`;

const Label = styled(Text)`
    font-weight: 400;
`;

const Value = styled(Text)<ValueProps>`
    color: ${(_props) => _props.color ?? 'none'};
    font-weight: 700;
`;

Wrapper.Row = Row;
Wrapper.Label = Label;
Wrapper.Value = Value;

export default Wrapper;
