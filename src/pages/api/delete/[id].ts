import prisma from '../../../config/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { id } = req.query

    try {
      const result = prisma.project.delete({
        where: {
          name: id as string,
        },
      })
      const additionalResult = prisma.todo.deleteMany({
        where: {
          project_name: id as string,
        },
      })

      const transaction = await prisma.$transaction([result, additionalResult])

      return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json(error)
    }
  }
}
