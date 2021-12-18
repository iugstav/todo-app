import prisma from '../../../../config/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.query

  const session = await getSession({ req })

  if (session) {
    if (req.method === 'GET') {
      try {
        const result = await prisma.todo.findMany({
          where: {
            Project: {
              name: name as string,
            },
            completed: false,
          },
          orderBy: {
            createdAt: 'asc',
          },
        })

        res.status(200).json(result)
      } catch (error) {
        res.status(400).json(error)
      }
    }
  } else {
    return res.status(401).json({ message: 'Não autorizado a acessar' })
  }
}
