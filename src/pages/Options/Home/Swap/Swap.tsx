import ROUTES from 'constants/routes';
import { Background, Wrapper } from 'theme/common';
import MarketHeader from '../MarketHeader';

const Swap: React.FC = () => {
    return (
        <Background style={{ minHeight: '100vh' }}>
            <Wrapper>
                <MarketHeader route={ROUTES.Options.Swap} />
            </Wrapper>
        </Background>
    );
};

export default Swap;
