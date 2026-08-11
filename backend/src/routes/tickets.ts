import { Router } from 'express';
import { Prisma, type PrismaClient } from '../generated/prisma/client.js';
import { z } from 'zod';

import { AppError } from '../errors.js';

const ticketStatusSchema = z.enum(['open', 'in_progress', 'resolved', 'closed']);

const createTicketSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1),
  user: z.string().trim().min(1).max(200),
});

const updateTicketSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().min(1).optional(),
  user: z.string().trim().min(1).max(200).optional(),
  status: ticketStatusSchema.optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field is required',
});

const createCommentSchema = z.object({
  author: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1),
});

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
  status: ticketStatusSchema.optional(),
  search: z.string().trim().max(100).optional(),
  sortBy: z.enum(['ticketNumber', 'title', 'status', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

const idSchema = z.coerce.number().int().positive();

const sortColumns = {
  ticketNumber: 'ticketNumber',
  title: 'title',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
} as const;

type TicketRecord = {
  id: bigint;
  ticketNumber: bigint;
  title: string;
  description: string;
  requester: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type CommentRecord = {
  id: bigint;
  author: string;
  body: string;
  createdAt: Date;
};

const formatTicket = (ticket: TicketRecord) => ({
  id: Number(ticket.id),
  ticketNumber: `TCK-${String(ticket.ticketNumber).padStart(6, '0')}`,
  title: ticket.title,
  description: ticket.description,
  user: ticket.requester,
  status: ticket.status,
  createdAt: ticket.createdAt,
  updatedAt: ticket.updatedAt,
});

const formatComment = (comment: CommentRecord) => ({
  id: Number(comment.id),
  author: comment.author,
  body: comment.body,
  createdAt: comment.createdAt,
});

const parseId = (value: string): bigint => BigInt(idSchema.parse(value));

const getTicketOrThrow = async (prisma: PrismaClient, id: bigint) => {
  const ticket = await prisma.ticket.findUnique({ where: { id } });

  if (!ticket) {
    throw new AppError(404, 'Ticket not found');
  }

  return ticket;
};

export const createTicketRouter = (prisma: PrismaClient): Router => {
  const router = Router();

  router.get('/', async (request, response, next) => {
    try {
      const query = listQuerySchema.parse(request.query);
      const where: Prisma.TicketWhereInput = {};

      if (query.status) {
        where.status = query.status;
      }

      if (query.search) {
        where.OR = [
          { title: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },
          { requester: { contains: query.search, mode: 'insensitive' } },
        ];
      }

      const orderBy = {
        [sortColumns[query.sortBy]]: query.sortOrder,
      } as Prisma.TicketOrderByWithRelationInput;
      const skip = (query.page - 1) * query.pageSize;

      const [total, tickets] = await prisma.$transaction([
        prisma.ticket.count({ where }),
        prisma.ticket.findMany({
          where,
          orderBy,
          skip,
          take: query.pageSize,
        }),
      ]);

      response.json({
        data: tickets.map(formatTicket),
        pagination: {
          page: query.page,
          pageSize: query.pageSize,
          total,
          totalPages: Math.ceil(total / query.pageSize),
        },
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (request, response, next) => {
    try {
      const ticket = await prisma.ticket.findUnique({
        where: { id: parseId(request.params.id) },
        include: { comments: { orderBy: { createdAt: 'asc' } } },
      });

      if (!ticket) {
        throw new AppError(404, 'Ticket not found');
      }

      response.json({
        ...formatTicket(ticket),
        comments: ticket.comments.map(formatComment),
      });
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (request, response, next) => {
    try {
      const input = createTicketSchema.parse(request.body);
      const ticket = await prisma.ticket.create({
        data: {
          title: input.title,
          description: input.description,
          requester: input.user,
        },
      });

      response.status(201).json(formatTicket(ticket));
    } catch (error) {
      next(error);
    }
  });

  router.patch('/:id', async (request, response, next) => {
    try {
      const id = parseId(request.params.id);
      const input = updateTicketSchema.parse(request.body);
      const data: Prisma.TicketUpdateInput = {};

      if (input.title !== undefined) data.title = input.title;
      if (input.description !== undefined) data.description = input.description;
      if (input.user !== undefined) data.requester = input.user;
      if (input.status !== undefined) data.status = input.status;

      const ticket = await prisma.ticket.update({ where: { id }, data });
      response.json(formatTicket(ticket));
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        next(new AppError(404, 'Ticket not found'));
        return;
      }

      next(error);
    }
  });

  router.delete('/:id', async (request, response, next) => {
    try {
      await prisma.ticket.delete({ where: { id: parseId(request.params.id) } });
      response.status(204).send();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        next(new AppError(404, 'Ticket not found'));
        return;
      }

      next(error);
    }
  });

  router.post('/:id/comments', async (request, response, next) => {
    try {
      const ticketId = parseId(request.params.id);
      await getTicketOrThrow(prisma, ticketId);
      const input = createCommentSchema.parse(request.body);
      const comment = await prisma.comment.create({
        data: {
          ticketId,
          author: input.author,
          body: input.body,
        },
      });

      response.status(201).json(formatComment(comment));
    } catch (error) {
      next(error);
    }
  });

  return router;
};

