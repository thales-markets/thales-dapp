import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import Parser from 'rss-parser';

type Blog = {
    title: string;
    'content:encoded': string;
    link: string;
    pubDate: Date;
    thumbnail: string;
};

type postsParserType = {
    description?: string;
    feedUrl?: string;
    generator?: string;
    image?: any;
    lastBuildDate?: string;
    link: string;
    paginationLinks?: any;
    title: string;
    webMaster?: string;
    items?: Blog[];
};

const mediumPostsQuery = (options?: UseQueryOptions<Blog[]>) => {
    return useQuery<Blog[]>(
        QUERY_KEYS.Medium.Posts,
        async () => {
            const parser: Parser<postsParserType> = new Parser();
            const feed = await parser.parseURL(
                'https://cors-anywhere.herokuapp.com/https://medium.com/feed/@thalesmarket'
            );
            return feed?.items;
        },
        {
            ...options,
        }
    );
};

export default mediumPostsQuery;
