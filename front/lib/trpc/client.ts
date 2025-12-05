import { createTRPCReact } from '@trpc/react-query';
import type { AnyRouter } from '@trpc/server';

// Une fois le backend configuré avec tRPC, remplacer par :
// import type { AppRouter } from '../../../back/infrastructure/framework/fastify/server';

export type AppRouter = AnyRouter;

export const trpc = createTRPCReact<AppRouter>();

