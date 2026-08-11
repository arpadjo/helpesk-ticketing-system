import { Link, Outlet } from 'react-router-dom';

import { useHealth } from '../hooks/use-health';

export function AppLayout() {
  const healthQuery = useHealth();
  const status = healthQuery.isSuccess ? 'Online' : healthQuery.isPending ? 'Checking' : 'Offline';

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/tickets">
          <span className="brand-mark">H</span>
          <span>Helpdesk</span>
        </Link>
        <div className={`service-status service-status--${status.toLowerCase()}`}>
          <span className="status-dot" />
          API {status}
        </div>
      </header>
      <Outlet />
    </div>
  );
}

