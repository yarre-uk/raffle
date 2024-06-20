import { Link, Outlet } from 'react-router-dom';
import { useAccount } from 'wagmi';

import { ROUTE } from '@/constants';
import { Profile } from '@/features';

const Layout = () => {
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col">
      <header className="flex h-12 w-full flex-row items-center justify-center gap-16 bg-slate-200">
        <Link className="text-lg font-normal" to={ROUTE.HOME}>
          HOME
        </Link>
        {isConnected && (
          <>
            <Link className="text-lg font-normal" to={ROUTE.PLAY}>
              PLAY
            </Link>
            <Link className="text-lg font-normal" to={ROUTE.GOVERNANCE}>
              GOVERNANCE
            </Link>
          </>
        )}
        <Profile />
      </header>
      <Outlet />
    </div>
  );
};

export default Layout;
