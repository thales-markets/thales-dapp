import { FlexDivCentered, Image } from 'theme/common';
import backArrow from 'assets/images/arrow-previous.svg';
import nextArrow from 'assets/images/arrow-next.svg';
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

type PaginationProps = {
    page: number;
    numberOfPages: number;
    setPage: (params: number) => void;
};

const Arrow = styled(Image)`
    color: #748bc6;
    width: 6px;
    height: 10px;
    box-sizing: content-box;
    cursor: pointer;
    padding: 10px;
    &.disabled {
        opacity: 0.2;
        cursor: default;
    }
`;

const Pagination: React.FC<PaginationProps> = ({ page, numberOfPages, setPage }) => {
    const { t } = useTranslation();

    const NextPage = () => {
        if (page === numberOfPages - 1) return;
        setPage(page + 1);
    };
    const PreviousPage = () => {
        if (page === 0) return;
        setPage(page - 1);
    };
    return (
        <>
            <div style={{ flex: '1 1 100%' }}></div>
            <FlexDivCentered>
                <p
                    style={{
                        margin: 0,
                        width: '64px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#F6F6FE',
                        marginRight: 4,
                    }}
                >
                    {t(`common.pagination.page`)}
                </p>
                <FlexDivCentered
                    style={{
                        border: '1px solid #0a2e66',
                        borderRadius: '32px',
                        width: '110px',
                        justifyContent: 'space-around',
                        height: '40px',
                    }}
                >
                    <Arrow src={backArrow} className={page === 0 ? 'disabled' : ''} onClick={PreviousPage} />
                    <p
                        style={{
                            fontSize: '13px',
                            fontWeight: 'bold',
                            letterSpacing: '0.4px',
                            color: '#F6F6FE',
                            margin: 0,
                        }}
                    >
                        {page + 1}
                    </p>
                    <Arrow
                        src={nextArrow}
                        className={page === numberOfPages - 1 ? 'disabled' : ''}
                        onClick={NextPage}
                    />
                </FlexDivCentered>
                <p
                    style={{
                        margin: 0,
                        width: '64px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#F6F6FE',
                        whiteSpace: 'pre',
                    }}
                >
                    {`${t(`common.of`)}  ${numberOfPages}`}
                </p>
            </FlexDivCentered>
        </>
    );
};

export default Pagination;
