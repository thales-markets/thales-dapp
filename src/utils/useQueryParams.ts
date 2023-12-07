import { useState } from 'react';

const getQuery = () => {
    if (typeof window !== 'undefined') {
        return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
};

export const getQueryStringVal = (key: string): string | null => {
    return getQuery().get(key);
};

const useQueryParam = (key: string, defaultVal: string): [string, (val: string) => void] => {
    const [query, setQuery] = useState(getQueryStringVal(key) || defaultVal);

    const updateUrl = (newVal: string) => {
        setQuery(newVal);

        const query = getQuery();

        query.delete('undefined');
        if (newVal.trim() !== '') {
            query.set(key, newVal);
        } else {
            query.delete(key);
        }

        if (typeof window !== 'undefined') {
            const { protocol, pathname, host } = window.location;
            const newUrl = `${protocol}//${host}${pathname}?${query.toString()}`;
            window.history.pushState({}, '', newUrl);
        }
    };

    return [query, updateUrl];
};

export default useQueryParam;
