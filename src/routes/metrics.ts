import { FastifyInstance } from "fastify";
import { meals } from "../../db/schema/schema";
import { db } from "../database";
import { count } from "drizzle-orm";
import { eq } from "drizzle-orm";

export async function metricsRoutes(app: FastifyInstance) {
    app.get("/metrics", async (request, reply) => {
        
        const totalMeals = await db.select({count: count()}).from(meals)
        const totalMealsInsideDiet = await db.select({count: count()}).from(meals).where(eq(meals.insideInDiet, true))
        const totalMealsOutsideDiet = await db.select({count: count()}).from(meals).where(eq(meals.insideInDiet, false))


        const totalMealsData = await db.select().from(meals)

        const { bestOnDietSequence } = totalMealsData.reduce(
          (acc, meal) => {
            if (meal.insideInDiet) {
              acc.currentSequence += 1
            } else {
              acc.currentSequence = 0
            }
      
            if (acc.currentSequence > acc.bestOnDietSequence) {
              acc.bestOnDietSequence = acc.currentSequence
            }
      
            return acc
          },
          { bestOnDietSequence: 0, currentSequence: 0 },
        )

        return { totalMeals, totalMealsInsideDiet, totalMealsOutsideDiet, bestOnDietSequence }

    });
}