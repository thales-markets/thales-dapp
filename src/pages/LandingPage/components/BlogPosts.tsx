import React, { useState } from 'react';
import styled from 'styled-components';
import mediumPostsQuery from '../queries/mediumPostsQuery';

// import nextArrow from 'assets/images/arrow-next.svg';
// import backArrow from 'assets/images/arrow-previous.svg';

const limitBlogMeta = (text: string, limit: number) => {
    //Remove html tags from text
    text = text.replace(/<\/?[^>]+(>|$)/g, '');

    return text?.length > limit ? text.substring(0, limit) + '...' : text;
};

const formatDate = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
};

const BlogPosts: React.FC = () => {
    const blogPostsQuery = mediumPostsQuery({ enabled: true });
    const [blogPostsCount, setBlogPostsCount] = useState<number>(3);
    const blogPosts =
        blogPostsQuery.isSuccess && blogPostsQuery?.data?.length
            ? blogPostsQuery.data.slice(blogPostsCount - 3, blogPostsCount)
            : [];

    const carouselChangeHandler = (change: number) => {
        if (change < 0) {
            return blogPostsCount + change < 3 ? setBlogPostsCount(3) : setBlogPostsCount(blogPostsCount + change);
        }

        setBlogPostsCount(blogPostsCount + change);

        if (blogPostsQuery?.data)
            if (blogPostsCount == blogPostsQuery?.data.length)
                setBlogPostsCount(blogPostsQuery?.data.length ? blogPostsQuery?.data.length : 3);
    };

    return (
        <Wrapper>
            <Arrow
                className="icon icon--left"
                style={{ marginLeft: '-25px', fontSize: 35 }}
                onClick={() => carouselChangeHandler(-1)}
            />
            {blogPosts.map((blog, index) => {
                return (
                    <BlogCard key={index} onClick={() => window.open(blog.link, '_blank')}>
                        <BlogTitle>{limitBlogMeta(blog.title, 50)}</BlogTitle>
                        <BlogDescription>
                            <p>{limitBlogMeta(blog['content:encoded'], 200)}</p>
                        </BlogDescription>
                        <MediumDate>{formatDate(blog.pubDate)}</MediumDate>
                        <MediumIcon className="icon-home icon-home--medium" />
                    </BlogCard>
                );
            })}
            <Arrow
                className="icon icon--right"
                style={{ marginRight: '-25px', fontSize: 35 }}
                onClick={() => carouselChangeHandler(1)}
            />
            <DotContainer>
                {blogPosts.map((_blog, index) => {
                    return (
                        <Dot
                            className={blogPostsCount === 3 + index ? 'selected' : ''}
                            onClick={setBlogPostsCount.bind(this, 3 + index)}
                            key={index}
                        />
                    );
                })}
            </DotContainer>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    overflow: hidden;
    padding: 2.2em;
    @media (max-width: 600px) {
        padding: 2em 0;
        padding-bottom: 40px;
        margin-bottom: 40px;
        & > img {
            display: none;
        }
        & > div:not(:nth-child(2)) {
            display: none;
        }
    }

    @media (max-width: 1024px) {
        & > div:not(:nth-child(-n + 3)) {
            display: none;
        }
        & > div:nth-child(-n + 3) {
            min-width: 47%;
        }
    }
`;

const BlogCard = styled.div`
    height: 345px;
    margin-left: 10px;
    margin-right: 10px;
    flex: 1;
    padding: 40px 30px 50px 30px;
    background: var(--background);
    box-shadow: 0px 20px 30px rgba(0, 0, 0, 0.1);
    border-radius: 7px;
    position: relative;
    cursor: pointer;
    overflow: hidden;
    @media (max-width: 600px) {
        height: 300px;
        margin-left: 0;
        margin-right: 0;
    }
`;

const BlogTitle = styled.p`
    font-family: Playfair Display !important;
    font-style: normal;
    font-weight: normal;
    font-size: 1.56em;
    line-height: 91.91%;
    text-transform: capitalize;
    color: var(--color-white);
    margin-bottom: 15px;
`;

const BlogDescription = styled.div`
    font-family: Nunito !important;
    font-style: normal;
    font-weight: 300;
    font-size: 1em;
    line-height: 1.2em;
    color: var(--color-white);
`;

const MediumIcon = styled.i`
    position: absolute;
    font-size: 2em;
    bottom: 10px;
    right: 25px;
`;

const MediumDate = styled.i`
    position: absolute;
    font-size: 1em;
    bottom: 1.2em;
    left: 30px;
    color: var(--color-white);
    font-style: italic;
`;

const Arrow = styled.i`
    color: 'var(--color-white)';
    cursor: pointer;
    @media (max-width: 600px) {
        display: none !important;
    }
`;

const DotContainer = styled.div`
    bottom: 0px;
    @media (max-width: 600px) {
        display: flex !important;
        justify-content: center;
        align-items: center;
    }
    position: absolute;
    display: none;
`;

const Dot = styled.div`
    background: var(--color-white);
    width: 1em;
    height: 1em;
    border-radius: 50%;
    opacity: 0.6;
    &.selected {
        opacity: 1;
    }
    margin-right: 7px;
    margin-left: 7px;
`;

export default BlogPosts;
