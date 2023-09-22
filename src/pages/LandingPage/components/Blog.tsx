import React from 'react';
import styled from 'styled-components';
import BlogPosts from './BlogPosts';
import { useTranslation } from 'react-i18next';

const Blog: React.FC = () => {
    const { t } = useTranslation();

    return (
        <FlexWrapper>
            <Title style={{ marginTop: 100 }}> {t('landing-page.newest-blog-posts')}</Title>
            <BlogPosts />
        </FlexWrapper>
    );
};

const Title = styled.h2`
    font-family: Playfair Display !important;
    font-style: normal;
    font-weight: bold;
    font-size: 4.4em;
    @media (max-width: 600px) {
        font-size: 2em;
    }
    line-height: 91.91%;
    text-align: center;
    color: ${(props) => props.theme.landingPage.textColor.primary};
`;

const FlexWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: 1122px;
    align-items: center;
    padding: 0 20px;
`;

export default Blog;
