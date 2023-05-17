import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import Parser from 'rss-parser';
import { LINKS } from 'constants/links';

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

const useMediumPostsQuery = (options?: UseQueryOptions<Blog[]>) => {
    return useQuery<Blog[]>(
        QUERY_KEYS.Medium.Posts,
        async () => {
            const parser: Parser<postsParserType> = new Parser();
            const feed = await parser.parseURL(LINKS.ThalesAPI.medium);
            return feed?.items;
        },
        {
            ...options,
        }
    );
};

export default useMediumPostsQuery;
