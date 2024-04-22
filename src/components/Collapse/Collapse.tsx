import { Collapse as MaterialCollapse } from '@material-ui/core';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { useState } from 'react';
import styled from 'styled-components';

type CollapseProps = {
    title: string;
};

const Collapse: React.FC<CollapseProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <CollapseContainer>
            <Highlight
                cursor="pointer"
                onClick={() => {
                    setIsOpen(!isOpen);
                }}
            >
                <span>{title}</span>
                <CollapseIcon className={`icon ${isOpen ? 'icon--caret-up' : 'icon--caret-down'}`} />
            </Highlight>
            <MaterialCollapse in={isOpen}>{children}</MaterialCollapse>
        </CollapseContainer>
    );
};

const CollapseContainer = styled.div<{ hideLine?: boolean; marginBottom?: string }>`
    margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : '20px')};
    border-bottom: 3px solid ${(props) => props.theme.borderColor.secondary};
`;

const CollapseIcon = styled.i`
    padding-left: 3px;
    font-size: 13px;
`;

const Highlight = styled.div<{
    cursor?: string;
}>`
    color: ${(props) => props.theme.landingPage.textColor.primary};
    cursor: ${(props) => (props.cursor ? props.cursor : 'default')};
    font-family: Nunito;
    font-size: 24px;
    font-style: normal;
    line-height: 140%;
    display: flex;
    justify-content: space-between;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 18px;
    }
`;

export default Collapse;
