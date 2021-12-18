import prisma from '../../../config/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })

  if (session) {
    if (req.method === 'GET') {
      try {
        const result = await prisma.project.findMany({
          where: {
            userEmail: session.user.email,
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
        const { projectName } = req.body

        const result = await prisma.project.create({
          data: {
            name: projectName,
            User: {
              connect: { email: session.user.email },
            },
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

  res.end()
}
