import prisma from '../../../../config/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.query

  if (req.method === 'GET') {
    try {
      const result = await prisma.todo.findMany({
        where: {
          Project: {
            name: name as string,
          },
        },
      })

      res.status(200).json(result)
    } catch (error) {
      res.status(400).json(error)
    }
  }

  if (req.method === 'POST') {
    try {
      const { taskName } = req.body

      const result = await prisma.todo.create({
        data: {
          name: taskName,

          Project: {
            connect: { name: name as string },
          },
        },
      })

      res.status(200).json(result)
    } catch (error) {
      res.status(400).json(error)
    }
  }

  res.end()
}
