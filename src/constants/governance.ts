export enum SpaceKey {
    COUNCIL = 'thalescouncil.eth',
    TIPS = 'thalesgov.eth',
}

export const snapshotEndpoint = 'https://hub.snapshot.org/graphql';

export const NUMBER_OF_COUNCIL_MEMBERS = 4;

export enum StatusEnum {
    All = 'all',
    Pending = 'pending',
    Active = 'active',
    Closed = 'closed',
}

export enum ProposalTypeEnum {
    Single = 'single-choice',
    Weighted = 'weighted',
}
