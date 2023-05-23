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
    box-sizing: border-box;
    border-radius: 15px;
    padding: 18px 32px;
    border: 2px solid rgba(100, 217, 254, 0.5);
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    @media (max-width: 1250px) {
        margin-left: 40px;
    }
    @media (max-width: 768px) {
        padding: 8px;
        margin-left: 20px;
    }

    @media (max-width: 500px) {
        padding: 8px;
        margin-left: 10px;
    }
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
    color: ${(props) => props.theme.textColor.primary};
    font-size: 18px;
    line-height: 24px;
`;

const Label = styled(Text)`
    font-weight: 400;
    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

const Value = styled(Text)<ValueProps>`
    color: ${(props) => props.color ?? 'none'};
    font-weight: 700;
    @media (max-width: 768px) {
        font-size: 16px;
    }
    @media (max-width: 500px) {
        font-size: 14px;
    }
`;

Wrapper.Row = Row;
Wrapper.Label = Label;
Wrapper.Value = Value;

export default Wrapper;
