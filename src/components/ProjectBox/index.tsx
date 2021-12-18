import Link from 'next/link'
import useSWR from 'swr'
import api from '../../services/api'

import styles from './project.module.scss'

const fetcher = (url: string) => api.get(url).then((res) => res.data)

export function ProjectBox(props: Project) {
  const { data: todoData, error } = useSWR<Todo[]>(
    `/project/${props.name}`,
    fetcher
  )

  return (
    <Link href={`/${props.name}`} passHref>
      <a className={styles.projectBox}>
        <div className={styles.dataWrapper}>
          <p className={styles.projectName}> {props.name} </p>
          <p className={styles.numberOfTasks}>
            {' '}
            {error ? 'erro' : !todoData ? 0 : todoData.length} tarefas{' '}
          </p>
        </div>
      </a>
    </Link>
  )
}
