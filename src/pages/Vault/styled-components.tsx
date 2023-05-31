import { ScreenSizeBreakpoint } from 'constants/ui';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivStart, FlexDivRow, FlexDiv } from 'theme/common';

export const Wrapper = styled(FlexDivColumn)`
    width: 100%;
    align-items: center;
    color: ${(props) => props.theme.textColor.primary};
`;

export const Container = styled(FlexDivRow)`
    width: 100%;
    position: relative;
    align-items: start;
    margin-top: 30px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
        width: 95%;
    }
`;

const ContentContainer = styled(FlexDivColumn)`
    width: 100%;
    flex: initial;
    align-items: center;
    position: relative;
    font-weight: 400;
    font-size: 18px;
    line-height: 20px;
    margin-bottom: 15px;
    p {
        margin-bottom: 10px;
    }
`;

export const LeftContainer = styled(ContentContainer)`
    margin-right: 25px;
    width: 60%;
    align-items: start;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-right: 0px;
        padding-top: 0px;
        width: 100%;
    }
`;

export const RightContainer = styled(ContentContainer)`
    border: 2px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 15px;
    width: 40%;
    padding: 30px 40px 20px 40px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 20px 20px 10px 20px;
        width: 100%;
    }
`;

export const RoundInfoWrapper = styled(FlexDivColumn)`
    width: 100%;
    padding: 0px 20px 20px 20px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 20px 20px 0px 20px;
        width: 95%;
    }
`;

export const RoundEndContainer = styled(FlexDivColumn)`
    align-items: center;
    font-size: 20px;
    span {
        font-size: 30px;
        font-weight: 600;
        color: ${(props) => props.theme.textColor.quaternary};
    }
    margin-bottom: 15px;
`;

export const RoundEndLabel = styled.p`
    margin-bottom: 10px;
`;

export const RoundEnd = styled.p`
    font-weight: 600;
    font-size: 25px;
    color: ${(props) => props.theme.textColor.quaternary};
`;

export const RoundAllocationWrapper = styled(FlexDivCentered)`
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
    }
`;

export const RoundAllocationContainer = styled(FlexDivColumn)`
    align-items: center;
    max-width: 200px;
    padding: 5px 0;
    :not(:last-child) {
        border-right: 2px solid ${(props) => props.theme.borderColor.primary};
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        :not(:last-child) {
            border-right: none;
        }
    }
`;

export const RoundAllocationLabel = styled.p`
    margin-bottom: 6px;
`;

export const RoundAllocation = styled.p`
    font-size: 25px;
    font-weight: 600;
    color: ${(props) => props.theme.textColor.quaternary};
`;

export const RoundInfoContainer = styled(FlexDivColumn)`
    align-items: center;
`;

export const RoundInfo = styled.p`
    font-size: 20px;
    font-weight: 600;
    color: ${(props) => props.theme.textColor.quaternary};
`;

export const Description = styled.div`
    font-size: 18px;
    line-height: 22px;
    text-align: start;
    padding-top: 20px;
    p {
        margin-bottom: 10px;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 16px;
    }
`;

export const Info = styled(Description)`
    border-bottom: 3px solid ${(props) => props.theme.borderColor.primary};
    padding-bottom: 10px;
    padding-top: 0px;
`;

export const VariablesContainer = styled(FlexDivRow)`
    width: 100%;
    ul {
        list-style: initial;
        margin-left: 20px;
    }
    li {
        margin-bottom: 4px;
    }
`;

export const VariablesTitle = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 100%;
    margin-top: 10px;
    color: ${(props) => props.theme.textColor.quaternary};
`;

export const Variables = styled(Description)`
    font-size: 16px;
    width: 50%;
`;

export const ContentInfoContainer = styled.div`
    margin-bottom: 15px;
`;

export const ContentInfo = styled.p`
    text-align: center;
`;

export const WarningContentInfo = styled(ContentInfo)`
    ${(props) => props.theme.warning.textColor.primary};
`;

export const BoldContent = styled.span`
    font-weight: 600;
`;

export const Title = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 27px;
    line-height: 100%;
    margin-bottom: 30px;
    margin-top: 10px;
    width: 100%;
    text-align: center;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-top: 0px;
        font-size: 25px;
    }
`;

export const TitleVaultIcon = styled.i`
    font-weight: 400;
    font-size: 36px;
    margin-right: 8px;
    top: -3px;
    position: relative;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 30px;
    }
`;

export const UsersInVaultText = styled(ContentInfo)`
    margin-top: 10px;
    margin-bottom: 10px;
`;

export const VaultFilledText = styled(ContentInfo)`
    margin-top: 10px;
    margin-bottom: 10px;
`;

export const VaultFilledGraphicContainer = styled(FlexDivStart)`
    position: relative;
    width: 100%;
    height: 14px;
    background: ${(props) => props.theme.background.secondary};
    border-radius: 15px;
    margin-bottom: 10px;
`;

export const VaultFilledGraphicPercentage = styled(FlexDivStart)<{ width: number }>`
    position: absolute;
    width: ${(props) => props.width}%;
    transition: width 1s linear;
    height: 10px;
    left: 2px;
    top: 2px;
    background: linear-gradient(90deg, #36d1dc -1.48%, #5b86e5 102.44%);
    border-radius: 15px;
`;

export const ButtonContainer = styled(FlexDivCentered)<{ mobileDirection?: string }>`
    @media (max-width: 675px) {
        flex-direction: ${(props) => props.mobileDirection || 'column'};
        button {
            margin: 10px 10px;
            :first-child {
                margin-bottom: ${(props) => (props.mobileDirection ? '20px' : '10px')};
            }
            :last-child {
                margin-bottom: ${(props) => (props.mobileDirection ? '10px' : '20px')};
            }
        }
    }
`;

export const LeftLoaderContainer = styled(FlexDivCentered)`
    position: relative;
    min-height: 240px;
    width: 100%;
`;

export const RightLoaderContainer = styled(FlexDivCentered)`
    position: relative;
    min-height: 350px;
    width: 100%;
`;

export const ToggleContainer = styled(FlexDiv)`
    font-weight: 600;
    margin-bottom: 20px;
    width: 100%;
    text-transform: uppercase;
    border-bottom: 2px solid ${(props) => props.theme.borderColor.primary};
    padding-bottom: 20px;
`;

export const Link = styled.a`
    color: ${(props) => props.theme.link.textColor.primary};
    &:hover {
        text-decoration: underline;
    }
`;
