import React from 'react';
import styled from 'styled-components';

type MarketWidgetContentProps = {
    children: React.ReactNode;
};

export const MarketWidgetContent: React.FC<MarketWidgetContentProps> = ({ children }) => {
    return <Content>{children}</Content>;
};

const Content = styled.div`
    overflow: auto;
    height: 100%;
    ::-webkit-scrollbar {
        width: 5px;
    }
    ::-webkit-scrollbar-track {
        background: #04045a;
    }
    ::-webkit-scrollbar-thumb {
        border-radius: 15px;
        background: #355dff;
    }
    ::-webkit-scrollbar-thumb:active {
        background: #44e1e2;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: rgb(67, 116, 255);
    }
`;

export default MarketWidgetContent;
