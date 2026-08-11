import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useAddComment, useDeleteTicket, useTicket, useUpdateTicket } from '../hooks/use-tickets';
import { formatDate } from '../lib/format';
import { TicketForm } from '../components/ticket-form';
import { TicketStatusBadge } from '../components/ticket-status';

export function TicketDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const ticketQuery = useTicket(id);
  const updateMutation = useUpdateTicket(id);
  const deleteMutation = useDeleteTicket();
  const commentMutation = useAddComment(id);
  const [isEditing, setIsEditing] = useState(false);
  const [author, setAuthor] = useState('');
  const [body, setBody] = useState('');

  if (ticketQuery.isPending) return <main className="page-container"><div className="empty-state">Loading ticket…</div></main>;
  if (ticketQuery.isError) return <main className="page-container"><div className="alert alert--error">{ticketQuery.error.message}</div><Link className="text-link" to="/tickets">Back to tickets</Link></main>;

  const ticket = ticketQuery.data;

  const handleDelete = () => {
    if (window.confirm(`Delete ${ticket.ticketNumber}? This cannot be undone.`)) {
      deleteMutation.mutate(id, { onSuccess: () => navigate('/tickets') });
    }
  };

  const handleComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    commentMutation.mutate({ author: author.trim(), body: body.trim() }, {
      onSuccess: () => { setAuthor(''); setBody(''); },
    });
  };

  return (
    <main className="page-container page-container--narrow">
      <Link className="back-link" to="/tickets">← All tickets</Link>
      <section className="detail-header">
        <div><p className="eyebrow">{ticket.ticketNumber}</p><h1>{ticket.title}</h1><p className="page-subtitle">Opened by {ticket.user} on {formatDate(ticket.createdAt)}</p></div>
        <div className="detail-actions"><TicketStatusBadge status={ticket.status} /><button className="button button--secondary" onClick={() => setIsEditing((value) => !value)}>{isEditing ? 'Cancel' : 'Edit'}</button><button className="button button--danger" disabled={deleteMutation.isPending} onClick={handleDelete}>Delete</button></div>
      </section>

      {updateMutation.isError && <div className="alert alert--error">{updateMutation.error.message}</div>}
      {isEditing ? <section className="panel"><h2>Edit ticket</h2><TicketForm initialValues={ticket} submitLabel="Save changes" isSubmitting={updateMutation.isPending} onSubmit={(values) => updateMutation.mutate(values, { onSuccess: () => setIsEditing(false) })} /></section> : <section className="panel ticket-description"><h2>Description</h2><p>{ticket.description}</p><div className="updated-label">Last updated {formatDate(ticket.updatedAt)}</div></section>}

      <section className="panel"><div className="section-heading"><div><p className="eyebrow">Conversation</p><h2>Comments <span className="count">{ticket.comments.length}</span></h2></div></div>{ticket.comments.length === 0 ? <p className="muted">No comments yet.</p> : <div className="comments">{ticket.comments.map((comment) => <article className="comment" key={comment.id}><div className="comment__meta"><strong>{comment.author}</strong><span>{formatDate(comment.createdAt)}</span></div><p>{comment.body}</p></article>)}</div>}<form className="comment-form" onSubmit={handleComment}><input placeholder="Your name" value={author} onChange={(event) => setAuthor(event.target.value)} required /><textarea placeholder="Add a comment…" value={body} onChange={(event) => setBody(event.target.value)} required rows={3} /><button className="button button--secondary" disabled={commentMutation.isPending}>{commentMutation.isPending ? 'Adding…' : 'Add comment'}</button></form></section>
    </main>
  );
}

