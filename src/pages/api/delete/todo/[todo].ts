import prisma from '../../../../config/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })

  if (req.method === 'POST') {
    const { todo } = req.body

    if (session) {
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
    } else {
      return res.status(401).json({ message: 'Não autorizado a acessar' })
    }
  }
}
