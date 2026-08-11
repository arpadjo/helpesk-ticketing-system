import { useState } from 'react';
import { Link } from 'react-router-dom';

import { ticketStatuses, type TicketStatus } from '../api/tickets';
import { useTickets } from '../hooks/use-tickets';
import { statusLabels } from '../lib/format';
import { TicketStatusBadge } from '../components/ticket-status';

const pageSize = 8;

export function TicketListPage() {
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    page: 1,
    status: '' as TicketStatus | '',
    search: '',
    sortBy: 'createdAt' as const,
    sortOrder: 'desc' as const,
  });

  const ticketQuery = useTickets({
    ...filters,
    pageSize,
    status: filters.status || undefined,
  });

  const pagination = ticketQuery.data?.pagination;

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFilters((current) => ({ ...current, page: 1, search: searchInput.trim() }));
  };

  const updateFilter = <K extends keyof typeof filters>(key: K, value: (typeof filters)[K]) => {
    setFilters((current) => ({ ...current, [key]: value, page: 1 }));
  };

  return (
    <main className="page-container">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Operations desk</p>
          <h1>Tickets</h1>
          <p className="page-subtitle">Track incoming issues and keep work moving.</p>
        </div>
        <Link className="button button--primary" to="/tickets/new">New ticket <span>＋</span></Link>
      </section>

      <section className="toolbar" aria-label="Ticket filters">
        <form className="search-form" onSubmit={submitSearch}>
          <input
            aria-label="Search tickets"
            placeholder="Search tickets…"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <button className="button button--secondary" type="submit">Search</button>
        </form>
        <select aria-label="Filter by status" value={filters.status} onChange={(event) => updateFilter('status', event.target.value as TicketStatus | '')}>
          <option value="">All statuses</option>
          {ticketStatuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
        </select>
        <select aria-label="Sort tickets" value={filters.sortBy} onChange={(event) => updateFilter('sortBy', event.target.value as typeof filters.sortBy)}>
          <option value="createdAt">Newest</option>
          <option value="updatedAt">Recently updated</option>
          <option value="title">Title</option>
          <option value="status">Status</option>
          <option value="ticketNumber">Ticket number</option>
        </select>
      </section>

      {ticketQuery.isError && <div className="alert alert--error">{ticketQuery.error.message}</div>}
      {ticketQuery.isPending && <div className="empty-state">Loading tickets…</div>}
      {ticketQuery.data && ticketQuery.data.data.length === 0 && <div className="empty-state"><strong>No tickets found.</strong><span>Try changing your filters or create a new ticket.</span></div>}
      {ticketQuery.data && ticketQuery.data.data.length > 0 && (
        <>
          <div className="ticket-list">
            {ticketQuery.data.data.map((ticket) => (
              <Link className="ticket-card" to={`/tickets/${ticket.id}`} key={ticket.id}>
                <div className="ticket-card__topline"><span className="ticket-number">{ticket.ticketNumber}</span><TicketStatusBadge status={ticket.status} /></div>
                <h2>{ticket.title}</h2>
                <p>{ticket.description}</p>
                <div className="ticket-card__meta"><span>{ticket.user}</span><span>{ticket.createdAt.toLocaleDateString()}</span></div>
              </Link>
            ))}
          </div>
          <div className="pagination">
            <span>{pagination?.total ?? 0} tickets</span>
            <div className="pagination__controls">
              <button className="button button--secondary" disabled={filters.page <= 1} onClick={() => updateFilter('page', filters.page - 1)}>Previous</button>
              <span>Page {pagination?.page ?? filters.page} of {Math.max(pagination?.totalPages ?? 1, 1)}</span>
              <button className="button button--secondary" disabled={!pagination || filters.page >= pagination.totalPages} onClick={() => updateFilter('page', filters.page + 1)}>Next</button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

