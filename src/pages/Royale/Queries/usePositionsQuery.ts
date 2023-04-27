import { useQuery, UseQueryOptions } from 'react-query';
import { NetworkId } from 'utils/network';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';

export type Positions = {
    up: number;
    down: number;
};

const usePositionsQuery = (selectedSeason: number, networkId: NetworkId, options?: UseQueryOptions<Positions>) => {
    return useQuery<Positions>(
        QUERY_KEYS.Royale.Positions(selectedSeason, networkId),
        async () => {
            const { thalesRoyaleContract } = snxJSConnector;
            return getFromContract(thalesRoyaleContract, selectedSeason);
        },
        {
            ...options,
        }
    );
};

const getFromContract = async (RoyaleContract: any, selectedSeason: number): Promise<Positions> => {
    const seasonContract = Number(await RoyaleContract.season());
    const season = selectedSeason === seasonContract ? seasonContract : selectedSeason;
    const roundContract = await RoyaleContract.roundInASeason(season);
    const round = Number(roundContract) === 0 ? 1 : roundContract;

    const [downPositions, upPositions] = await Promise.all([
        RoyaleContract.positionsPerRoundPerSeason(season, round, 1),
        RoyaleContract.positionsPerRoundPerSeason(season, round, 2),
    ]);
    return {
        up: Number(upPositions),
        down: Number(downPositions),
    };
};

export default usePositionsQuery;
