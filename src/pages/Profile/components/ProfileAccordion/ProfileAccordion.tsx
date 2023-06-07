import React, { useState } from 'react';
import { ReactComponent as ArrowDown } from 'assets/images/wizard/arrow-down.svg';
import { ReactComponent as ArrowUp } from 'assets/images/wizard/arrow-up.svg';
import styled from 'styled-components';
import { ScreenSizeBreakpoint } from 'enums/ui';

type ProfileAccordionProps = {
    title: string;
};

const ProfileAccordion: React.FC<ProfileAccordionProps> = ({ title, children }) => {
    const [isOpened, setIsOpened] = useState(true);

    return (
        <Accordion
            isOpened={isOpened}
            onClick={() => {
                setIsOpened(!isOpened);
            }}
        >
            <AccordionHeader>{title}</AccordionHeader>
            {isOpened && <AccordionContent>{children}</AccordionContent>}
            {isOpened ? <StyledArrowUp /> : <StyledArrowDown />}
        </Accordion>
    );
};

const Accordion = styled.div<{ isOpened: boolean }>`
    width: 100%;
    display: ${(props) => (props.isOpened ? '' : 'flex')};
    justify-content: space-between;
    cursor: pointer;
    border: 2px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 15px;
    position: relative;
    margin-bottom: 10px;
`;

const AccordionHeader = styled.p`
    font-weight: 700;
    font-size: 18px;
    line-height: 16px;
    color: ${(props) => props.theme.textColor.quaternary};
    padding: 20px 60px 20px 30px;
    span {
        text-transform: lowercase;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 15px 60px 15px 15px;
        font-size: 15px;
        line-height: 22px;
    }
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
`;

const AccordionContent = styled.div`
    color: ${(props) => props.theme.textColor.primary};
    padding: 0 30px 20px 30px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 0px 15px 15px 15px;
    }
`;

const StyledArrowUp = styled(ArrowUp)`
    position: absolute;
    top: 20px;
    right: 30px;
    path {
        fill: ${(props) => props.theme.textColor.quaternary};
        fill-opacity: 1;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        right: 15px;
        height: 12px;
    }
`;

export const StyledArrowDown = styled(ArrowDown)`
    position: absolute;
    top: 20px;
    right: 30px;
    path {
        fill: ${(props) => props.theme.textColor.quaternary};
        fill-opacity: 1;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        right: 15px;
        height: 12px;
    }
`;

export default ProfileAccordion;
