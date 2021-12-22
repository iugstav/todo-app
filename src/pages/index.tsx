import { FormEvent, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { GetServerSideProps } from 'next'
import useSWR from 'swr'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { MdOutlineChecklist, MdOutlineAdd } from 'react-icons/md'
import { ProjectBox } from '../components/ProjectBox'
import { DataError } from '../components/DataError'

import styles from '../styles/indexPage.module.scss'
import { authServer } from '../utils/session'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await authServer(ctx)

  return { props: { user } }
}

function Index({ user }: any) {
  const fetcher = (url: string) =>
    api
      .get(url, {
        params: {
          email: user.email,
        },
      })
      .then((res) => res.data)

  const [projectName, setProjectName] = useState<string>('')
  const router = useRouter()

  const { data, error, mutate } = useSWR<Project[]>('/project', fetcher)

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()

      if (projectName.trim() !== '') {
        api
          .post<Project>('/project', {
            projectName: projectName,
            email: user.email,
          })
          .then((res) => {
            const response = res.data as Project
            mutate([...data, response], false)
            setProjectName('')
          })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projectName, data, mutate]
  )

  useEffect(() => {
    if (!user) {
      router.push('/auth/authPage')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.indexPageWrapper}>
      <main className={styles.mainContent}>
        <form className={styles.formWrapper} onSubmit={handleSubmit}>
          <div className={styles.input}>
            <span>
              <MdOutlineChecklist size="24px" color="#a8a8b3" />
            </span>
            <input
              required
              type="text"
              name="projectName"
              autoComplete="off"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Digite o nome do projeto"
            />
          </div>

          <button type="submit" className={styles.createProject}>
            <MdOutlineAdd size="24px" /> <span>Criar</span>
          </button>
        </form>

        <div
          className={`${styles.projectsDiv} ${
            !data || data.length === 0 ? styles.emptyProjects : ''
          }`}
        >
          {/* condition inside condition */}
          {error ? (
            <DataError />
          ) : !data || data.length === 0 ? (
            <div className={styles.ifEmpty}>
              <div className={styles.undrawWrapper}>
                <Image
                  src="/assets/add-notes.svg"
                  width={220}
                  height={220}
                  className={styles.undraw}
                  alt="Adicione Projetos"
                  priority
                />
              </div>
              <div className={styles.emptyText}>
                <p>Opa! Parece que você não tem projetos.</p>
                <p>Que tal criar um?</p>
              </div>
            </div>
          ) : (
            data.map((project) => {
              return (
                <ProjectBox
                  id={project.id}
                  key={project.id}
                  name={project.name}
                  tasks={project.tasks || 0}
                />
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}

export default Index
