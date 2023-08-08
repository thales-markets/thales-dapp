import React from 'react';
import styled from 'styled-components';
import ZeusPotentialWinBackground from 'assets/images/zeus-potential-win.png';
import Footer from '../Footer/Footer';

const PotentialWinCard: React.FC = () => {
    return (
        <Container>
            <Footer />
        </Container>
    );
};

const Container = styled.div`
    border: 10px solid #03dac5;
    border-radius: 15px;
    width: 383px;
    height: 510px;
    padding: 10px 10px;
    background: url(${ZeusPotentialWinBackground}), lightgray 50% / cover no-repeat;
`;

export default PotentialWinCard;
