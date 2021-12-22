import prisma from '../../../config/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { email } = req.query
      const result = await prisma.project.findMany({
        where: {
          User: {
            email: email as string,
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      })

      return res.status(200).json(result)
    } catch (error) {
      res.status(400).json(error)
    }
  }

  if (req.method === 'POST') {
    try {
      const { projectName, email } = req.body

      const result = await prisma.project.create({
        data: {
          name: projectName,
          User: {
            connect: {
              email: email as string,
            },
          },
        },
      })

      res.status(200).json(result)
    } catch (error) {
      res.status(400).json(error)
    }
  }
}
