import styled from 'styled-components';

export const SideContent = styled.p`
    width: 461px;
    @media (max-width: 768px) {
        width: min(100%, 316px);
    }
`;

export const List = styled.ul`
    list-style-position: outside;
    padding-left: 20px;
    list-style: disc;
`;
