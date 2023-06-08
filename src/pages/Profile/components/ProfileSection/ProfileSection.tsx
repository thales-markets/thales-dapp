import React from 'react';
import styled from 'styled-components';
import { ScreenSizeBreakpoint } from 'enums/ui';

type ProfileSectionProps = {
    title: string;
    fullHeight?: boolean;
};

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children, fullHeight }) => {
    return (
        <Section>
            <SectionHeader>{title}</SectionHeader>
            <SectionContent fullHeight={fullHeight}>{children}</SectionContent>
        </Section>
    );
};

const Section = styled.div`
    width: 100%;
    justify-content: space-between;
    border-radius: 15px;
    position: relative;
    margin-bottom: 15px;
`;

const SectionHeader = styled.p`
    font-weight: 700;
    font-size: 21px;
    line-height: 16px;
    color: ${(props) => props.theme.textColor.primary};
    padding: 10px 0px 20px 0px;
    span {
        text-transform: lowercase;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 10px 0px 10px 0px;
        font-size: 18px;
        line-height: 22px;
    }
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
`;

const SectionContent = styled.div<{ fullHeight?: boolean }>`
    color: ${(props) => props.theme.textColor.primary};
    padding: 0 0px 0px 0px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 0px 0px 0px 0px;
    }
    max-height: ${(props) => (props.fullHeight ? 'initial' : '320px')};
    overflow-x: auto;
`;

export default ProfileSection;
