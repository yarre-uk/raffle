import { Route, Routes } from 'react-router-dom';
import { useAccount } from 'wagmi';

import { Layout } from './components';
import { ROUTE } from './constants';
import { GovernancePage, HomePage, PlayPage } from './pages';

const App = () => {
  const { isConnected } = useAccount();

  return (
    <Routes>
      <Route path={ROUTE.HOME} element={<Layout />}>
        <Route index element={<HomePage />} />
        {isConnected && (
          <>
            <Route path={ROUTE.PLAY} element={<PlayPage />} />
            <Route path={ROUTE.GOVERNANCE} element={<GovernancePage />} />
          </>
        )}

        <Route path="*" element={<div>404</div>} />
      </Route>
    </Routes>
  );
};

export default App;
