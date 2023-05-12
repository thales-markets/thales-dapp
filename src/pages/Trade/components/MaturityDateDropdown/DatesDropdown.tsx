import React, { useEffect, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import styled from 'styled-components';
import { formatShortDateFromTimestamp } from 'utils/formatters/date';

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
        <OutsideClickHandler onOutsideClick={() => open && setOpen(false)}>
            <Wrapper>
                <Container onClick={setOpen.bind(this, !open)}>
                    {date && <Date onClick={setDate.bind(this, date)}>{formatShortDateFromTimestamp(date)}</Date>}
                    {!open && <Icon className="icon icon--caret-down" />}
                </Container>
                {open && (
                    <Dropdown onClick={setOpen.bind(this, !open)}>
                        {allDates.map((_date, index) => {
                            if (date === _date) return;
                            return (
                                <DateContainer key={index}>
                                    <Date onClick={setDate.bind(this, _date)}>
                                        {formatShortDateFromTimestamp(_date)}
                                    </Date>
                                </DateContainer>
                            );
                        })}
                    </Dropdown>
                )}
            </Wrapper>
        </OutsideClickHandler>
    );
};

const Wrapper = styled.div`
    position: relative;
    z-index: 100;
    max-height: 23px;
    height: 23px;
`;

const Icon = styled.i`
    font-size: 12px;
    color: ${(props) => props.theme.textColor.secondary};
`;

const Container = styled.div`
    width: 267px;
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
    width: 267px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    border-radius: 8px;
    background: var(--color-secondary);
    cursor: pointer;
`;

const Date = styled.p`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 100%;
    text-transform: uppercase;
    color: var(--color-text);
`;

const DateContainer = styled.div`
    border-radius: 8px;
    background: var(--color-secondary);
    &:hover {
        background: var(--color-secondary-hover);
    }
    width: 100%;
    padding: 5px 15px;
`;

export default DatesDropdown;
