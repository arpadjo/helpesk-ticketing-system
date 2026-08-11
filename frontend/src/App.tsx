import { Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from './components/app-layout';
import { TicketDetailPage } from './pages/ticket-detail-page';
import { NewTicketPage } from './pages/new-ticket-page';
import { TicketListPage } from './pages/ticket-list-page';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/tickets" replace />} />
        <Route path="tickets" element={<TicketListPage />} />
        <Route path="tickets/new" element={<NewTicketPage />} />
        <Route path="tickets/:id" element={<TicketDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;
