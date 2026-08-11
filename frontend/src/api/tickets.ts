import { z } from 'zod';

import { requestJson } from './client';

export const ticketStatuses = ['open', 'in_progress', 'resolved', 'closed'] as const;
export type TicketStatus = (typeof ticketStatuses)[number];

const ticketSchema = z.object({
  id: z.number(),
  ticketNumber: z.string(),
  title: z.string(),
  description: z.string(),
  user: z.string(),
  status: z.enum(ticketStatuses),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

const commentSchema = z.object({
  id: z.number(),
  author: z.string(),
  body: z.string(),
  createdAt: z.coerce.date(),
});

const ticketDetailSchema = ticketSchema.extend({
  comments: z.array(commentSchema),
});

const ticketListSchema = z.object({
  data: z.array(ticketSchema),
  pagination: z.object({
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

const emptyResponseSchema = z.undefined();

export type Ticket = z.infer<typeof ticketSchema>;
export type TicketDetail = z.infer<typeof ticketDetailSchema>;
export type Comment = z.infer<typeof commentSchema>;
export type TicketList = z.infer<typeof ticketListSchema>;

export type TicketListParams = {
  page: number;
  pageSize: number;
  status?: TicketStatus;
  search?: string;
  sortBy: 'ticketNumber' | 'title' | 'status' | 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
};

export type CreateTicketInput = Pick<Ticket, 'title' | 'description' | 'user'>;
export type UpdateTicketInput = Partial<Pick<Ticket, 'title' | 'description' | 'user' | 'status'>>;
export type CreateCommentInput = Pick<Comment, 'author' | 'body'>;

const toQueryString = (params: TicketListParams): string => {
  const query = new URLSearchParams();
  query.set('page', String(params.page));
  query.set('pageSize', String(params.pageSize));
  query.set('sortBy', params.sortBy);
  query.set('sortOrder', params.sortOrder);

  if (params.status) query.set('status', params.status);
  if (params.search) query.set('search', params.search);

  return query.toString();
};

export const fetchTickets = (params: TicketListParams): Promise<TicketList> =>
  requestJson(`/tickets?${toQueryString(params)}`, ticketListSchema);

export const fetchTicket = (id: string): Promise<TicketDetail> =>
  requestJson(`/tickets/${id}`, ticketDetailSchema);

export const createTicket = (input: CreateTicketInput): Promise<Ticket> =>
  requestJson('/tickets', ticketSchema, { method: 'POST', body: input });

export const updateTicket = (id: string, input: UpdateTicketInput): Promise<Ticket> =>
  requestJson(`/tickets/${id}`, ticketSchema, { method: 'PATCH', body: input });

export const deleteTicket = (id: string): Promise<undefined> =>
  requestJson(`/tickets/${id}`, emptyResponseSchema, { method: 'DELETE' });

export const addComment = (id: string, input: CreateCommentInput): Promise<Comment> =>
  requestJson(`/tickets/${id}/comments`, commentSchema, { method: 'POST', body: input });
