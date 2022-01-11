import React from 'react';
import styled from 'styled-components';
import mediumPostsQuery from '../mediumPostsQuery';

const BlogPosts: React.FC = () => {
    const blogPostsQuery = mediumPostsQuery({ enabled: true });
    const blogPosts = blogPostsQuery.isSuccess ? blogPostsQuery.data.slice(0, 3) : [];
    console.log(blogPosts);

    return (
        <Wrapper>
            {blogPosts.map((blog, index) => {
                return (
                    <BlogCard key={index} onClick={() => window.open(blog.link, '_blank')}>
                        <BlogTitle>{blog.title}</BlogTitle>
                        <BlogDescription>
                            <Thumbnail src={blog.thumbnail}></Thumbnail>
                        </BlogDescription>
                        <MediumIcon className="icon-home icon-home--medium" />
                    </BlogCard>
                );
            })}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    padding: 50px 90px;
`;

const Thumbnail = styled.img`
    object-fit: contain;
    max-height: 150px;
    margin-top: 50px;
`;

const BlogCard = styled.div`
    height: 345px;
    max-width: 32%;
    flex: 1;
    padding: 40px 30px 50px 30px;
    background: var(--background);
    box-shadow: 0px 20px 30px rgba(0, 0, 0, 0.1);
    border-radius: 7px;
    position: relative;
    cursor: pointer;
`;

const BlogTitle = styled.p`
    font-family: Playfair Display !important;
    font-style: normal;
    font-weight: normal;
    font-size: 25px;
    line-height: 91.91%;
    text-transform: capitalize;
    color: var(--color);
`;

const BlogDescription = styled.div`
    font-family: Nunito !important;
    font-style: normal;
    font-weight: 300;
    font-size: 17px;
    line-height: 91.91%;
    text-transform: capitalize;
    color: var(--color);
`;

const MediumIcon = styled.i`
    position: absolute;
    bottom: 10px;
    right: 10px;
`;

export default BlogPosts;
