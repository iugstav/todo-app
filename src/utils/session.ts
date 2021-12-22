import nookies from 'nookies'
import adminInit from '../services/firebaseAdmin'

export const authServer = async (ctx: any) => {
  const { idToken } = nookies.get(ctx)

  try {
    return adminInit.auth().verifyIdToken(idToken)
  } catch (err) {
    return null
  }
}
