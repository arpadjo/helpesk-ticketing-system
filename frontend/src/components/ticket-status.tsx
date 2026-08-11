import type { TicketStatus } from '../api/tickets';
import { statusLabels } from '../lib/format';

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return <span className={`badge badge--${status}`}>{statusLabels[status]}</span>;
}

