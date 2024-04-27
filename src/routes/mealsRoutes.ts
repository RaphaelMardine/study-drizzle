import { FastifyInstance } from "fastify";
import { db } from "../database";
import { meals } from "../../db/schema/schema";
import z from "zod";
import { eq } from "drizzle-orm";
import { checkSessionIdExists } from "../middlewares/check-session-id";
import { and } from "drizzle-orm";

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    "/list",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      try {
        const { sessionId } = request.cookies

        const mealList = await db.select().from(meals).where(eq(meals.session_id, sessionId));
        return reply.send(mealList);
      } catch (error) {
        console.log(error, "error");
        return reply.status(400).send;
      }
    }
  );

  app.get("/:id", async (request, reply) => {
    const getMealParamsSchema = z.object({
      id: z.string(),
    });

    const { id } = getMealParamsSchema.parse(request.params);

    if (!id) {
      return reply.status(500).send("Id is required");
    }

    let sessionId = request?.cookies?.sessionId;

    const meal = await db.select().from(meals).where(and(eq(meals.id, id), eq(meals.session_id, sessionId)));
    return reply.send(meal);
  });

  app.post(
    "/create",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      try {
        const createMealBodySchema = z.object({
          nameFood: z.string(),
          description: z.string(),
          insideInDiet: z.boolean(),
        });

        const { nameFood, description, insideInDiet } =
          createMealBodySchema.parse(request.body);

        let sessionId = request?.cookies?.sessionId;

        await db.insert(meals).values({
          nameFood,
          description,
          insideInDiet,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          session_id: sessionId
        });

        return reply.status(201).send();
      } catch (error) {
        console.log(error, "error");
        return reply.status(400).send(error);
      }
    }
  );

  app.delete(
    "/delete/:id",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const deleteMealParamsSchema = z.object({
        id: z.string(),
      });

      const { id } = deleteMealParamsSchema.parse(request.params);

      if (!id) {
        return reply.status(500).send("Id is required");
      }

      let sessionId = request?.cookies?.sessionId;

      await db.delete(meals).where(and(eq(meals.id, id), eq(meals.session_id, sessionId)));
      return reply.send();
    }
  );

  app.patch("/update/:id", async (request, reply) => {
    const updateMealParamsSchema = z.object({
      id: z.string(),
    });

    const updateMealBodySchema = z.object({
      nameFood: z.string().optional(),
      description: z.string().optional(),
      insideInDiet: z.boolean().optional(),
    });

    const { id } = updateMealParamsSchema.parse(request.params);
    const { nameFood, description, insideInDiet } = updateMealBodySchema.parse(
      request.body
    );

    if (!id) {
      return reply.status(500).send("Id is required");
    }

    let sessionId = request?.cookies?.sessionId;

    await db
      .update(meals)
      .set({
        nameFood,
        description,
        insideInDiet,
        updatedAt: Date.now(),
      })
      .where(and(eq(meals.id, id), eq(meals.session_id, sessionId)));

    return reply.send();
  });
}
