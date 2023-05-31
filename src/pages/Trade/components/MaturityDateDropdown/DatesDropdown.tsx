import React, { useEffect, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import styled from 'styled-components';
import { formatShortDateWithTime } from 'utils/formatters/date';

type AssetDropdownProps = {
    date: number | undefined;
    setDate: React.Dispatch<React.SetStateAction<number | undefined>>;
    allDates: number[];
};

const DatesDropdown: React.FC<AssetDropdownProps> = ({ date, setDate, allDates }) => {
    // states
    const [open, setOpen] = useState(false);

    // hooks
    useEffect(() => {
        if (allDates[0]) setDate(allDates[0]);
    }, [allDates]);

    return (
        <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
            <Wrapper>
                <Container onClick={() => setOpen(!open)}>
                    {date && <Date onClick={() => setDate(date)}>{formatShortDateWithTime(date)}</Date>}
                    <Icon className={open ? `icon icon--caret-up` : `icon icon--caret-down`} />
                </Container>
                {open && (
                    <Dropdown onClick={() => setOpen(!open)}>
                        {allDates.map((_date, index) => (
                            <DateContainer key={index}>
                                <Date onClick={() => setDate(_date)}>{formatShortDateWithTime(_date)}</Date>
                            </DateContainer>
                        ))}
                    </Dropdown>
                )}
            </Wrapper>
        </OutsideClickHandler>
    );
};

const Wrapper = styled.div`
    position: relative;
    z-index: 1;
    max-height: 23px;
    height: 23px;
`;

const Icon = styled.i`
    font-size: 12px;
    color: ${(props) => props.theme.textColor.primary};
`;

const Container = styled.div`
    width: 100%;
    max-height: 23px;
    padding: 5px 15px;
    height: 23px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px;
    background: var(--color-secondary);
    cursor: pointer;
`;

const Dropdown = styled.div`
    margin-top: 5px;
    padding: 5px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    border-radius: 8px;
    background: ${(props) => props.theme.background.secondary};
    cursor: pointer;
    z-index: 100;
    text-align: start;
`;

const Date = styled.p`
    font-weight: 600;
    font-size: 13px;
    line-height: 100%;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.primary};
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
`;

const DateContainer = styled.div`
    border-radius: 8px;
    background: ${(props) => props.theme.background.secondary};
    &:hover {
        background: ${(props) => props.theme.background.primary};
    }
    width: 100%;
    padding: 5px 10px;
`;

export default DatesDropdown;
