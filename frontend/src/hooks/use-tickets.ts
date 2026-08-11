import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  addComment,
  createTicket,
  deleteTicket,
  fetchTicket,
  fetchTickets,
  updateTicket,
  type CreateCommentInput,
  type CreateTicketInput,
  type TicketListParams,
  type UpdateTicketInput,
} from '../api/tickets';

export const ticketsQueryKey = ['api', 'tickets'] as const;

export const ticketQueryKey = (id: string) => [...ticketsQueryKey, id] as const;

export const useTickets = (params: TicketListParams) =>
  useQuery({
    queryKey: [...ticketsQueryKey, params],
    queryFn: () => fetchTickets(params),
    placeholderData: (previousData) => previousData,
  });

export const useTicket = (id: string) =>
  useQuery({
    queryKey: ticketQueryKey(id),
    queryFn: () => fetchTicket(id),
    enabled: Boolean(id),
  });

export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTicketInput) => createTicket(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ticketsQueryKey }),
  });
};

export const useUpdateTicket = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTicketInput) => updateTicket(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ticketsQueryKey }),
  });
};

export const useDeleteTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTicket(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: ticketQueryKey(id) });
      return queryClient.invalidateQueries({ queryKey: ticketsQueryKey });
    },
  });
};

export const useAddComment = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCommentInput) => addComment(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ticketQueryKey(id) }),
  });
};
