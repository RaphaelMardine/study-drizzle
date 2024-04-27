import { FastifyInstance } from "fastify";
import z from "zod";
import { randomUUID } from "node:crypto";
import { db } from "../database";
import { user } from "../../db/schema/schema";
import { eq } from "drizzle-orm";

export async function userRoutes(app: FastifyInstance) {
    app.post("", async (request, reply) => {
        const createUserBodySchema = z.object({
          name: z.string(),
          email: z.string().email(),
        });
      
        let sessionId = request?.cookies?.sessionId;
        console.log(sessionId, 'sessionId')
      
        if (!sessionId) {
          sessionId = randomUUID();
      
          reply.setCookie("sessionId", sessionId, {
            path: "/",
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
          });
        }
      
        const { name, email } = createUserBodySchema.parse(request.body);
      
        const userAlreadyExist = await db
          .select()
          .from(user)
          .where(eq(user.email, email));

          console.log(userAlreadyExist, 'userAlreadyExist')
      
        if (userAlreadyExist.length > 0) {
          return reply.status(400).send({ message: "User already exists" });
        }
      
        await db.insert(user).values({
          id: randomUUID(),
          name,
          email,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          session_id: sessionId,
        });
      
        return reply.status(201).send();
      });
}