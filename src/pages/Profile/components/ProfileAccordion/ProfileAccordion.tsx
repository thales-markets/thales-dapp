import React, { useState } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionHeader,
    StyledArrowDown,
    StyledArrowUp,
} from 'pages/Profile/styled-components';

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

export default ProfileAccordion;
