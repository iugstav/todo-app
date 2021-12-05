import prisma from '../../../config/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const result = await prisma.project.findMany()

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
        },
      })

      res.status(200).json(result)
    } catch (error) {
      res.status(400).json(error)
    }
  }

  res.end()
}
