import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { auth, googleAuthProvider } from '../services/firebase'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { destroyCookie, setCookie } from 'nookies'
import api from '../services/api'
import { useRouter } from 'next/router'

type User = {
  id: string
  name: string
  email: string
  image: string
  createdAt?: Date
}

type AuthContextType = {
  user: User | undefined
  signInWithGoogle: () => Promise<void>
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>()
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { displayName, photoURL, uid, email } = user

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account')
        }

        setUser({
          id: uid,
          name: displayName,
          image: photoURL,
          email: email,
        })

        user.getIdToken().then((token: string) =>
          setCookie(null, 'idToken', token, {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
          })
        )
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  async function signInWithGoogle() {
    await signInWithPopup(auth, googleAuthProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result)

        console.log('sign with google', result.user)

        api
          .post('/auth/sign', {
            user: {
              name: result.user.displayName,
              email: result.user.email,
              image: result.user.photoURL,
              uid: result.user.uid,
            },
          })
          .then((res) => {
            if (res) {
              router.push('/')
            }
          })

        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code
        const errorMessage = error.message
        // The email of the user's account used.
        const email = error.email
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error)
        // ...
      })
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export const signout = async () => {
  destroyCookie(null, 'idToken')
  await signOut(auth)
}
