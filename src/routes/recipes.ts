import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { checkSessionIdExists } from '../middlewares/validateSessionId'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export const recipesRoute = async (app: FastifyInstance) => {
  app.addHook('preHandler', checkSessionIdExists)

  app.post('/', async (request: FastifyRequest, response: FastifyReply) => {
    const recipeRequestBodySchema = z.object({
      name: z.string().min(4),
      description: z.string().min(10),
      isOnDiet: z.boolean(),
      date: z.coerce.date(),
    })
    const { date, description, isOnDiet, name } = recipeRequestBodySchema.parse(
      request.body,
    )

    await knex('recipes').insert({
      id: randomUUID(),
      name,
      description,
      user_id: request.user?.id,
      date,
      is_on_diet: isOnDiet,
    })

    return response.status(201).send()
  })
}
