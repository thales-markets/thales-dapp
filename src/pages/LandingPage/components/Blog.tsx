import React from 'react';
import BlogPosts from './BlogPosts';
import { useTranslation } from 'react-i18next';
import { FlexWrapper, Title } from './styled-components';

const Blog: React.FC = () => {
    const { t } = useTranslation();

    return (
        <FlexWrapper>
            <Title style={{ marginTop: 100 }}> {t('landing-page.newest-blog-posts')}</Title>
            <BlogPosts />
        </FlexWrapper>
    );
};

export default Blog;
