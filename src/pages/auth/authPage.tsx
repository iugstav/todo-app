import Image from 'next/image'
import { useState } from 'react'
import { FiUserPlus } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { MdLogin } from 'react-icons/md'

import styles from '../../styles/login.module.scss'

export default function authPage() {
  let userNameReGexp: RegExp = /^[A-Za-z]+$/
  let emailRegexp: RegExp = new RegExp(
    "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
  )

  const [hasAccount, setHasAccount] = useState<boolean>(false)

  const toggleHasAccount = () => setHasAccount((prevState) => !prevState)

  return (
    <div className={styles.loginAuth}>
      <main className={styles.mainContent}>
        {!hasAccount ? (
          <div className={styles.signUpFormWrapper}>
            <header className={styles.formIntro}>
              <Image src="/assets/noteme-form.svg" width={45} height={57} />
              <h2>Bem-vindo!</h2>
            </header>

            <button className={styles.googleButton}>
              <FcGoogle size="28px" /> Cadastre-se com o Google
            </button>

            <div className={styles.separator}>ou crie uma conta</div>

            <form className={styles.signUp}>
              <label htmlFor="userName">Nome</label>
              <input
                type="text"
                name="userName"
                placeholder="John Doe"
                className={styles.signUpFormInput}
              />

              <label htmlFor="userEmail">Email</label>
              <input
                type="email"
                name="userEmail"
                placeholder="johndoe25@gmail.com"
                className={styles.signUpFormInput}
              />

              <label htmlFor="userPassword">Senha</label>
              <input
                type="password"
                name="userPassword"
                placeholder="********"
                className={styles.signUpFormInput}
              />

              <button type="submit" className={styles.submitAuthForm}>
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

            <button className={styles.googleButton}>
              <FcGoogle size="28px" /> Entre com o Google
            </button>

            <div className={styles.separator}>ou crie uma conta</div>

            <form className={styles.logIn}>
              <label htmlFor="loggedUserName">Email</label>
              <input
                type="email"
                name="loggedUserName"
                placeholder="johndoe25@gmail.com"
                className={styles.signUpFormInput}
              />

              <label htmlFor="loggedUserPassword">Senha</label>
              <input
                type="password"
                name="loggedUserPassword"
                placeholder="********"
                className={styles.signUpFormInput}
              />
              <button type="submit" className={styles.submitAuthForm}>
                <MdLogin size="24px" color="#fff" /> Entrar
              </button>

              <p className={styles.switchAuthMethod}>
                Já possui uma conta?{' '}
                <span onClick={toggleHasAccount} className={styles.fakeLink}>
                  Entrar
                </span>
              </p>
            </form>
          </div>
        )}
      </main>

      <aside className={styles.illustration}>
        <Image
          src="/assets/illustration.svg"
          width={440}
          height={360}
          priority
        />

        <strong>Organize seu dia a dia</strong>
        <p>Crie projetos e eleve sua rotina ao próximo nível. </p>
      </aside>
    </div>
  )
}
