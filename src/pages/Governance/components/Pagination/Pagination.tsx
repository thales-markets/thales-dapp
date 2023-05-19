import { Colors, FlexDivCentered, Image } from 'theme/common';
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
                <PageLabel>{t(`common.pagination.page`)}</PageLabel>
                <PageSelector>
                    <Arrow src={backArrow} className={page === 0 ? 'disabled' : ''} onClick={PreviousPage} />
                    <p
                        style={{
                            fontSize: '14px',
                            letterSpacing: '0.4px',
                            color: Colors.WHITE,
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
                </PageSelector>
                <p
                    style={{
                        margin: 0,
                        width: '64px',
                        fontSize: '14px',
                        textAlign: 'center',
                        color: Colors.WHITE,
                        whiteSpace: 'pre',
                    }}
                >
                    {`${t(`common.of`)}  ${numberOfPages}`}
                </p>
            </FlexDivCentered>
        </>
    );
};

const PageSelector = styled(FlexDivCentered)`
    border: 1px solid ${(props) => props.theme.borderColor.tertiary};
    background: ${(props) => props.theme.background.primary};
    border-radius: 20px;
    width: 110px;
    justify-content: space-around;
    height: 34px;
    @media (max-width: 767px) {
        height: 30px;
        width: 80px;
    }
`;

const PageLabel = styled.p`
    margin: 0;
    width: 64px;
    font-size: 14px;
    text-align: center;
    color: ${(props) => props.theme.textColor.primary};
    margin-right: 4px;
    @media (max-width: 767px) {
        width: 44px;
    }
`;

const Arrow = styled(Image)`
    color: ${(props) => props.theme.textColor.primary};
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

export default Pagination;
