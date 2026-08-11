import { useState } from 'react';

import { ticketStatuses, type Ticket, type TicketStatus } from '../api/tickets';
import { statusLabels } from '../lib/format';

type TicketFormProps = {
  initialValues?: Partial<Pick<Ticket, 'title' | 'description' | 'user' | 'status'>>;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (values: { title: string; description: string; user: string; status?: TicketStatus }) => void;
};

export function TicketForm({ initialValues, submitLabel, isSubmitting, onSubmit }: TicketFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [user, setUser] = useState(initialValues?.user ?? '');
  const [status, setStatus] = useState<TicketStatus | undefined>(initialValues?.status);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ title: title.trim(), description: description.trim(), user: user.trim(), status });
  };

  return (
    <form className="ticket-form" onSubmit={handleSubmit}>
      <label>
        Title
        <input value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={200} />
      </label>
      <label>
        Description
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} required rows={7} />
      </label>
      <label>
        User
        <input value={user} onChange={(event) => setUser(event.target.value)} required maxLength={200} />
      </label>
      {initialValues?.status && (
        <label>
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value as TicketStatus)}>
            {ticketStatuses.map((ticketStatus) => (
              <option key={ticketStatus} value={ticketStatus}>{statusLabels[ticketStatus]}</option>
            ))}
          </select>
        </label>
      )}
      <button className="button button--primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}

