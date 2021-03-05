import React from 'react';
import { Trans } from 'react-i18next';
import { LINKS } from '../../../constants/links';

const NewToBinaryOptions: React.FC = () => (
    <span style={{ marginBottom: 20 }}>
        <Trans
            i18nKey="options.new-to-binary-options"
            components={[<a href={LINKS.Blog.HowBinaryOptionsWork} key="link" target="_blank" rel="noreferrer" />]}
        />
    </span>
);

export default NewToBinaryOptions;
