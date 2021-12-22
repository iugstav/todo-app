import prisma from '../../../config/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user } = req.body

  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  })

  if (!userAlreadyExists) {
    try {
      const result = await prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          image: user.image,
        },
      })

      return res.status(200).redirect(`/`).json(result)
    } catch (error) {
      return res.status(400).json(error)
    }
  } else {
    res.redirect(200, `/`)
  }

  res.end()
}
