import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../config/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const taskId = req.query.id
  const { completed } = req.body

  if (req.method === 'PATCH') {
    try {
      const result = await prisma.todo.update({
        where: { id: taskId as string },
        data: { completed: completed },
      })

      return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json(error)
    }
  } else if (req.method === 'GET') {
    try {
      const result = await prisma.todo.findUnique({
        where: { id: taskId as string },
      })

      return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json(error)
    }
  }
}
