import React, { useEffect, useState } from 'react';
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
        <Wrapper>
            <Container onClick={setOpen.bind(this, !open)}>
                {date && <Date onClick={setDate.bind(this, date)}>Expires {formatShortDateFromTimestamp(date)}</Date>}
            </Container>
            {open && (
                <Dropdown onClick={setOpen.bind(this, !open)}>
                    {allDates.map((_date, index) => {
                        if (date === _date) return;
                        return (
                            <Date key={index} onClick={setDate.bind(this, _date)}>
                                Expires {formatShortDateFromTimestamp(_date)}
                            </Date>
                        );
                    })}
                </Dropdown>
            )}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    position: relative;
    z-index: 100;
    max-height: 36px;
`;

const Container = styled.div`
    width: 346px;
    height: 36px;
    padding: 0 16px;

    display: flex;
    justify-content: flex-start;
    align-items: center;

    border-radius: 16px;
    background: #27283f;
    cursor: pointer;
`;

const Dropdown = styled.div`
    margin-top: 9px;
    width: 346px;
    padding: 10px 16px;
    gap: 18px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    border-radius: 16px;
    background: #27283f;
    cursor: pointer;
`;

const Date = styled.p`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    /* identical to box height */

    color: #ffffff;
`;

export default DatesDropdown;
