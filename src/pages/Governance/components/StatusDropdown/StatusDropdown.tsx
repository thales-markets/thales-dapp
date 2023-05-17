import React, { useState } from 'react';
import { FlexDivCentered, FlexDiv, FlexDivColumn, FlexDivColumnCentered, FlexDivRowCentered } from 'theme/common';
import OutsideClickHandler from 'react-outside-click-handler';
import styled from 'styled-components';
import { StatusEnum } from 'constants/governance';
import { ReactComponent as DownIcon } from 'assets/images/down.svg';
import { useTranslation } from 'react-i18next';

type StatusDropdownProps = {
    activeStatus: StatusEnum;
    onSelect: any;
};

export const StatusDropdown: React.FC<StatusDropdownProps> = ({ activeStatus, onSelect }) => {
    const { t } = useTranslation();
    const [statusDropdownIsOpen, setStatusDropdownIsOpen] = useState(false);
    const setDropdownIsOpen = (isOpen: boolean) => {
        if (!isOpen && !statusDropdownIsOpen) {
            return;
        }
        setStatusDropdownIsOpen(isOpen);
    };

    return (
        <>
            <OutsideClickHandler onOutsideClick={() => setDropdownIsOpen(false)}>
                <Container>
                    <StatusButton
                        onClick={() => {
                            setDropdownIsOpen(!statusDropdownIsOpen);
                        }}
                        isActive={statusDropdownIsOpen}
                    >
                        <InnerButton>
                            <FlexDiv>{t(`governance.status.${activeStatus}`)}</FlexDiv>
                            <StyledDownIcon />
                        </InnerButton>
                    </StatusButton>
                    {statusDropdownIsOpen && (
                        <DropdownContainer>
                            <DropDown>
                                {Object.values(StatusEnum).map((status: string) => (
                                    <DropDownItem
                                        key={status}
                                        onClick={() => {
                                            onSelect(status);
                                            setDropdownIsOpen(false);
                                        }}
                                    >
                                        <FlexDivCentered>
                                            <StatusName>{t(`governance.status.${status}`)}</StatusName>
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
    @media (max-width: 767px) {
        width: 100%;
    }
`;

const StatusButton = styled.button<{ isActive: boolean }>`
    position: relative;
    width: 140px;
    height: 40px;
    border: none;
    background: linear-gradient(150.74deg, rgba(140, 114, 184, 0.6) -7.89%, rgba(106, 193, 213, 0.6) 107.94%);
    padding: 2px;
    border-radius: 23px;
    &:hover {
        cursor: pointer;
        background: #00f9ff;
    }
    @media (max-width: 767px) {
        width: 100%;
    }
`;

const InnerButton = styled(FlexDivRowCentered)`
    background: var(--color-tertiary);
    border-radius: 23px;
    font-weight: 500;
    font-size: 16px;
    line-height: 36px;
    letter-spacing: 0.35px;
    color: #f6f6fe;
    text-transform: capitalize;
    padding-left: 20px;
    padding-right: 20px;
`;

const DropdownContainer = styled.div`
    position: relative;
    z-index: 1000;
`;

const DropDown = styled(FlexDivColumn)`
    background: linear-gradient(281.48deg, var(--color-primary) -16.58%, var(--color-tertiary) 97.94%);
    border: 1px solid #4f759b;
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
        background: rgba(196, 196, 196, 0.1);
        border-radius: 12px;
    }
`;

const StatusName = styled.div`
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.35px;
    color: #f6f6fe;
    display: block;
    text-transform: capitalize;
`;

const StyledDownIcon = styled(DownIcon)`
    height: 15px;
    width: 15px;
    path {
        fill: #f6f6fe;
    }
`;

export default StatusDropdown;
