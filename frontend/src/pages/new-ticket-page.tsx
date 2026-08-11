import { Link, useNavigate } from 'react-router-dom';

import { TicketForm } from '../components/ticket-form';
import { useCreateTicket } from '../hooks/use-tickets';

export function NewTicketPage() {
  const navigate = useNavigate();
  const createMutation = useCreateTicket();

  return (
    <main className="page-container page-container--narrow">
      <Link className="back-link" to="/tickets">← All tickets</Link>
      <section className="page-heading page-heading--simple"><div><p className="eyebrow">New request</p><h1>Create a ticket</h1><p className="page-subtitle">Give IT the context they need to solve the issue.</p></div></section>
      {createMutation.isError && <div className="alert alert--error">{createMutation.error.message}</div>}
      <section className="panel"><TicketForm submitLabel="Create ticket" isSubmitting={createMutation.isPending} onSubmit={(values) => createMutation.mutate(values, { onSuccess: (ticket) => navigate(`/tickets/${ticket.id}`) })} /></section>
    </main>
  );
}

