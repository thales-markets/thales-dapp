import React from 'react';
import styled from 'styled-components';
import { FlexDiv } from 'theme/common';
import searchIcon from 'assets/images/search-icon.svg';
import { useTranslation } from 'react-i18next';

type SearchStakersProp = {
    assetSearch: string;
    setAssetSearch: (param: string) => void;
    className?: string;
};

const SearchStakers: React.FC<SearchStakersProp> = ({ assetSearch, setAssetSearch, className }) => {
    const { t } = useTranslation();

    return (
        <SearchWrapper className={className ? className : ''}>
            <SearchInput
                onChange={(e) => setAssetSearch(e.target.value)}
                onFocus={() =>
                    document.body.clientWidth < 600
                        ? document.getElementsByClassName('markets-mobile')[0]?.scrollIntoView({ behavior: 'smooth' })
                        : ''
                }
                value={assetSearch}
                placeholder={t(`governance.stakers.search-placeholder`)}
            />
        </SearchWrapper>
    );
};

const SearchWrapper = styled(FlexDiv)`
    align-items: center;
    position: relative;
    background: ${(props) => props.theme.background.tertiary};
    border-radius: 23px;
    margin: 22px 30px;
    &:before {
        content: url(${searchIcon});
        position: absolute;
        right: 16px;
        transform: scale(0.9);
    }
    @media (max-width: 767px) {
        margin: 20px 0px;
    }
`;

const SearchInput = styled.input`
    height: 35px;
    width: 300px;
    border-radius: 23px;
    border: none !important;
    outline: none !important;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    padding: 0 10px;
    letter-spacing: 0.15px;
    background: ${(props) => props.theme.background.primary};
    color: ${(props) => props.theme.textColor.primary};
    padding-left: 20px;
    padding-right: 44px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 2px;
    &::placeholder {
        font-size: 16px;
        color: ${(props) => props.theme.textColor.primary};
        opacity: 0.7;
    }
`;

export default SearchStakers;
