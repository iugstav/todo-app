import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { FiUserPlus } from 'react-icons/fi'
import { VscGithubInverted } from 'react-icons/vsc'
import { MdLogin } from 'react-icons/md'
import { BsQuestionCircleFill } from 'react-icons/bs'
import { Tooltip } from '@chakra-ui/tooltip'

import styles from '../../styles/login.module.scss'

export default function authPage() {
  let userNameReGexp: RegExp =
    /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/gm
  let emailRegexp: RegExp =
    /([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])/gm

  const [hasAccount, setHasAccount] = useState<boolean>(false)
  const [userName, setUserName] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')

  const toggleHasAccount = () => {
    setUserName('')
    setUserEmail('')

    setHasAccount((prevState) => !prevState)
  }

  return (
    <div className={styles.loginAuth}>
      <main className={styles.mainContent}>
        <div className={styles.signUpFormWrapper}>
          <header className={styles.formIntro}>
            <Image src="/assets/noteme-form.svg" width={45} height={57} />
            <h2>Bem-vindo!</h2>
          </header>

          <button
            className={styles.googleButton}
            onClick={() =>
              signIn('github', {
                callbackUrl: 'http://localhost:3000/',
              })
            }
          >
            <VscGithubInverted size="1.7rem" /> Cadastre-se com o Github
          </button>
        </div>

        {/* {!hasAccount ? (
          <div className={styles.signUpFormWrapper}>
            <header className={styles.formIntro}>
              <Image src="/assets/noteme-form.svg" width={45} height={57} />
              <h2>Bem-vindo!</h2>
            </header>

            <button
              className={styles.googleButton}
              onClick={() =>
                signIn('google', {
                  callbackUrl: 'http://localhost:3000/',
                })
              }
            >
              <FcGoogle size="28px" /> Cadastre-se com o Google
            </button>

            <div className={styles.separator}>ou crie uma conta</div>

            <form className={styles.signUp}>
              <label htmlFor="userName">
                Nome
                <Tooltip
                  hasArrow
                  bg="#f1f1f1"
                  color="#1a1a1a"
                  fontSize="14px"
                  placement="right-start"
                  label={
                    <p>
                      Seu nome não deve conter caracteres especiais &#40;&#38;,
                      &#35;, &#33;, &#43;, etc.&#41;
                    </p>
                  }
                >
                  <span>
                    <BsQuestionCircleFill size="16px" color="#7e7e86" />
                  </span>
                </Tooltip>
              </label>
              <input
                type="text"
                name="userName"
                placeholder="John Doe"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className={styles.signUpFormInput}
              />
              <label htmlFor="userEmail">Email</label>
              <input
                type="email"
                name="userEmail"
                placeholder="johndoe25@gmail.com"
                value={userEmail}
                onChange={(e) => {
                  setUserEmail(e.target.value)
                  console.log(userEmail)
                }}
                className={styles.signUpFormInput}
              />
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault()
                  signIn('email', {
                    userEmail,
                    callbackUrl: 'http://localhost:3000/',
                  })
                }}
                className={styles.submitAuthForm}
              >
                <FiUserPlus size="24px" color="#fff" /> Criar conta
              </button>
              <p className={styles.switchAuthMethod}>
                Já possui uma conta?{' '}
                <span onClick={toggleHasAccount} className={styles.fakeLink}>
                  Entrar
                </span>
              </p>
            </form>
          </div>
        ) : (
          <div className={styles.signInFormWrapper}>
            <header className={styles.formIntro}>
              <Image src="/assets/noteme-form.svg" width={45} height={57} />
              <h2>Olá novamente!</h2>
            </header>

            <button
              className={styles.googleButton}
              onClick={() => signIn('google')}
            >
              <FcGoogle size="28px" /> Entre com o Google
            </button>

            <div className={styles.separator}>ou entre com uma conta</div>

            <form className={styles.logIn}>
              <label htmlFor="loggedUserName">Email</label>
              <input
                type="email"
                name="loggedUserName"
                placeholder="johndoe25@gmail.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className={styles.signUpFormInput}
              />

              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault()
                  signIn('email', {
                    userEmail,
                    callbackUrl: 'http://localhost:3000/',
                  })
                }}
                className={styles.submitAuthForm}
              >
                <MdLogin size="24px" color="#fff" /> Entrar
              </button>

              <p className={styles.switchAuthMethod}>
                Ainda não criou uma conta?{' '}
                <span onClick={toggleHasAccount} className={styles.fakeLink}>
                  Crie já
                </span>
              </p>
            </form>
          </div>
        )} */}
      </main>

      <aside className={styles.illustration}>
        <div className={styles.illustrationImage}>
          <Image
            src="/assets/illustration.svg"
            width={440}
            height={360}
            layout="responsive"
            sizes="100vw"
            priority
          />
        </div>

        <strong>Organize seu dia a dia</strong>
        <p>Crie projetos e eleve sua rotina ao próximo nível. </p>
      </aside>
    </div>
  )
}
