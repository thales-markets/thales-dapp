import styled from 'styled-components';

export const PositionWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 0;
    z-index: 2;
`;

export const FiltersButton = styled.div<{ visible?: boolean }>`
    /* display: ${(_props) => (_props?.visible ? 'block' : 'none')}; */
    display: block;
    visibility: ${(_props) => (_props?.visible ? 'visible' : 'hidden')};
    padding: 6px 20px;
    border: 1.5px solid rgba(100, 217, 254, 0.5);
    box-sizing: border-box;
    border-radius: 30px;
    background: transparent;
    font-family: Roboto !important;
    cursor: pointer;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 11px;
    text-transform: uppercase;
    color: #64d9fe;
    align-self: center;
    margin-top: 20px;
    margin-bottom: 20px;
`;

export const Arrow = styled.i`
    margin-left: 5px;
    font-size: 15px;
    text-transform: none;
`;

export const Wrapper = styled.div<{ visible?: boolean }>`
    /* @media (max-width: 768px) { */
    display: ${(_props) => (_props?.visible ? 'flex' : 'none')};
    flex-direction: column;
    background: linear-gradient(270deg, #516aff 0%, #8208fc 100%);
    border: 2px solid rgba(100, 217, 254, 0.5);
    box-sizing: border-box;
    border-radius: 12px;
    padding: 15px 20px;
    max-width: 240px;
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    text-align: center;
    top: -56px;
    z-index: 2;
    /* } */
`;

export const Item = styled.div<{ active: boolean }>`
    text-transform: uppercase;
    cursor: pointer;
    font-family: Roboto !important;
    font-style: normal;
    color: ${(_props) => (_props?.active ? '#64d9fe' : '#ffffff')};
    display: flex;
    flex-direction: row;
    justify-content: center;
    @media (max-width: 768px) {
        font-weight: bold;
        font-size: 12px;
        line-height: 162.5%;
    }
`;

export const Title = styled.p`
    font-family: Roboto !important;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 100%;
    text-transform: uppercase;
    color: #64d9fe;
    margin-bottom: 10px;
`;
