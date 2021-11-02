import { ThalesRoyalData } from '../../getThalesRoyalData';
import React from 'react';
import { Text } from 'theme/common';

type ScoreboardProps = {
    royaleData: ThalesRoyalData;
};

const Scoreboard: React.FC<ScoreboardProps> = ({ royaleData }) => {
    return (
        <>
            <Text className="text-m white">
                Alive players:{' '}
                {royaleData ? royaleData.alivePlayers.length + ' / ' + royaleData.players.length : 0 + ' / ' + 0}
            </Text>

            <Text className="text-m white">
                Round: {royaleData ? royaleData.round + ' / ' + royaleData.rounds : 0 + ' / ' + 0}{' '}
            </Text>
        </>
    );
};

export default Scoreboard;
