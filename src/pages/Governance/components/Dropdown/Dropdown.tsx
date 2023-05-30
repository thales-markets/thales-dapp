import React, { useState } from 'react';
import { FlexDivCentered, FlexDiv, FlexDivColumn, FlexDivColumnCentered, FlexDivRowCentered } from 'theme/common';
import OutsideClickHandler from 'react-outside-click-handler';
import styled from 'styled-components';
import { ReactComponent as DownIcon } from 'assets/images/down.svg';
import { useTranslation } from 'react-i18next';
import { ScreenSizeBreakpoint } from 'constants/ui';

type DropdownProps = {
    options: any;
    activeOption: any;
    onSelect: any;
    translationKey: string;
};

export const Dropdown: React.FC<DropdownProps> = ({ options, activeOption, onSelect, translationKey }) => {
    const { t } = useTranslation();
    const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
    const handleDropdownOpening = (isOpen: boolean) => {
        if (!isOpen && !dropdownIsOpen) {
            return;
        }
        setDropdownIsOpen(isOpen);
    };

    return (
        <>
            <OutsideClickHandler onOutsideClick={() => handleDropdownOpening(false)}>
                <Container>
                    <Button
                        onClick={() => {
                            handleDropdownOpening(!dropdownIsOpen);
                        }}
                        isActive={dropdownIsOpen}
                    >
                        <InnerButton>
                            <FlexDiv>{t(`governance.${translationKey}.${activeOption}`)}</FlexDiv>
                            <StyledDownIcon />
                        </InnerButton>
                    </Button>
                    {dropdownIsOpen && (
                        <DropdownContainer>
                            <DropDown>
                                {options.map((options: string) => (
                                    <DropDownItem
                                        key={options}
                                        onClick={() => {
                                            onSelect(options);
                                            handleDropdownOpening(false);
                                        }}
                                    >
                                        <FlexDivCentered>
                                            <Name>{t(`governance.${translationKey}.${options}`)}</Name>
                                        </FlexDivCentered>
                                    </DropDownItem>
                                ))}
                            </DropDown>
                        </DropdownContainer>
                    )}
                </Container>
            </OutsideClickHandler>
        </>
    );
};

const Container = styled(FlexDivColumnCentered)`
    width: 140px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 100%;
        margin-bottom: 10px;
    }
`;

const Button = styled.button<{ isActive: boolean }>`
    position: relative;
    width: 140px;
    height: 40px;
    border: none;
    background: ${(props) => props.theme.background.secondary};
    padding: 2px;
    border-radius: 23px;
    &:hover {
        cursor: pointer;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 100%;
    }
`;

const InnerButton = styled(FlexDivRowCentered)`
    background: ${(props) => props.theme.background.secondary};
    border-radius: 23px;
    font-weight: 500;
    font-size: 16px;
    line-height: 36px;
    letter-spacing: 0.35px;
    color: ${(props) => props.theme.textColor.primary};
    text-transform: capitalize;
    padding-left: 20px;
    padding-right: 20px;
`;

const DropdownContainer = styled.div`
    position: relative;
    z-index: 1000;
`;

const DropDown = styled(FlexDivColumn)`
    background: ${(props) => props.theme.background.secondary};
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 20px;
    position: absolute;
    margin-top: 2px;
    padding: 8px;
    width: 100%;
`;

const DropDownItem = styled(FlexDiv)`
    padding: 8px 12px;
    cursor: pointer;
    &:hover {
        background: ${(props) => props.theme.background.primary};
        border-radius: 12px;
    }
`;

const Name = styled.div`
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.35px;
    color: ${(props) => props.theme.textColor.primary};
    display: block;
    text-transform: capitalize;
`;

const StyledDownIcon = styled(DownIcon)`
    height: 15px;
    width: 15px;
    path {
        fill: ${(props) => props.theme.textColor.primary};
    }
`;

export default Dropdown;
