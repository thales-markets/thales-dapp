import React from 'react';
import styled from 'styled-components';
import { ScreenSizeBreakpoint } from 'enums/ui';

type ProfileSectionProps = {
    title: string;
};

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children }) => {
    return (
        <Section>
            <SectionHeader>{title}</SectionHeader>
            <SectionContent>{children}</SectionContent>
        </Section>
    );
};

const Section = styled.div`
    width: 100%;
    justify-content: space-between;
    border-radius: 15px;
    position: relative;
    margin-bottom: 15px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-bottom: 10px;
    }
`;

const SectionHeader = styled.p`
    font-weight: 700;
    font-size: 21px;
    line-height: 16px;
    color: ${(props) => props.theme.textColor.primary};
    padding: 20px 0px 20px 10px;
    span {
        text-transform: lowercase;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 10px 0px 10px 5px;
        font-size: 15px;
        line-height: 22px;
    }
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
`;

const SectionContent = styled.div`
    color: ${(props) => props.theme.textColor.primary};
    padding: 0 10px 10px 0px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 0px 10px 10px 10px;
    }
    max-height: 320px;
    overflow-x: auto;
`;

export default ProfileSection;
