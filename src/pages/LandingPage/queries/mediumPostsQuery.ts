import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';

type Blog = {
    title: string;
    description: string;
    link: string;
    pubDate: Date;
    thumbnail: string;
};

const mediumPostsQuery = (options?: UseQueryOptions<Blog[]>) => {
    return useQuery<Blog[]>(
        QUERY_KEYS.Medium.Posts,
        async () => {
            const url = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@thalesmarket';
            const response = await fetch(url);
            const result = JSON.parse(await response.text());
            return result.items;
        },
        {
            ...options,
        }
    );
};

export default mediumPostsQuery;
