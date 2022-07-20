import styled from 'styled-components';

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const HeaderWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const Description = styled.p`
    font-size: 16px;
    color: var(--primary-color);
    margin-bottom: 10px;
`;
