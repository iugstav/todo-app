import prisma from '../../../../config/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { todo } = req.body

    try {
      const result = await prisma.todo.delete({
        where: {
          id: todo as string,
        },
      })

      return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json(error)
    }
  }
}
