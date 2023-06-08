import React from 'react';
import styled from 'styled-components';
import { ScreenSizeBreakpoint } from 'enums/ui';

type ProfileSectionProps = {
    title: string;
    maxHeight?: string;
};

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children, maxHeight }) => {
    return (
        <Section>
            <SectionHeader>{title}</SectionHeader>
            <SectionContent maxHeight={maxHeight}>{children}</SectionContent>
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
`;

const SectionContent = styled.div<{ maxHeight?: string }>`
    color: ${(props) => props.theme.textColor.primary};
    overflow-y: auto;
    padding-right: 4px;
    max-height: ${(props) => props.maxHeight || '320px'};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        max-height: ${(props) => props.maxHeight || '340px'};
    }
    &::-webkit-scrollbar {
        width: 5px;
    }
`;

export default ProfileSection;
