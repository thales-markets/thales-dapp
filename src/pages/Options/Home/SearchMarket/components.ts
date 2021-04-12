import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, Image } from 'theme/common';

export const Wrapper = styled(FlexDivCentered)`
    position: absolute;
    bottom: -135px;
    background: radial-gradient(60.71% 77.54% at 27.56% 12.79%, #415fff 0%, #867ccd 100%);
    border-radius: 24px;
    width: 1100px;
    height: 270px;
    align-self: center;
`;

export const SearchWrapper = styled(FlexDivColumn)`
    flex: 1;
    padding: 38px 0 46px 50px;
`;

export const SearchTitle = styled.p`
    width: 400px;
    font-weight: 600;
    font-size: 31px;
    line-height: 48px;
    letter-spacing: 0.25px;
    color: #f6f6fe;
`;
export const SerachInput = styled.input`
    height: 65px;
    border-radius: 16px;
    border: none !important;
    outline: none !important;
    font-weight: 600;
    font-size: 20px;
    line-height: 40px;
    padding: 0 20px;
    letter-spacing: 0.15px;

    /* dusty lavander */

    color: #748bc6;
`;

export const ImageWrapper = styled.div`
    position: relative;
    flex: 1;
`;

export const SearchImage = styled(Image)`
    height: 300px;
    position: absolute;
    right: -120px;
    top: -84px;
`;
