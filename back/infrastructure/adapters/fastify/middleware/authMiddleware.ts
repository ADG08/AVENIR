import { FastifyRequest, FastifyReply } from 'fastify';
import { JwtService, JwtPayload } from '../../auth/JwtService';

declare module 'fastify' {
    interface FastifyRequest {
        user?: JwtPayload;
    }
}

export const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // Create JwtService inside the middleware to ensure env vars are loaded
        const jwtService = new JwtService();

        const accessToken = request.cookies.accessToken;

        if (!accessToken) {
            return reply.code(401).send({
                error: 'Unauthorized',
                message: 'Access token missing',
            });
        }

        const payload = jwtService.verifyAccessToken(accessToken);

        if (!payload) {
            return reply.code(401).send({
                error: 'Unauthorized',
                message: 'Invalid or expired access token',
            });
        }

        request.user = payload;
    } catch (error) {
        return reply.code(401).send({
            error: 'Unauthorized',
            message: 'Authentication failed',
        });
    }
};
