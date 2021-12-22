import { useRouter } from 'next/router'
import Link from 'next/link'
import { ChangeEvent, FormEvent, useCallback, useRef, useState } from 'react'
import useSWR, { unstable_serialize } from 'swr'
import { useSWRConfig } from 'swr'
import api from '../services/api'

import { Todo } from '../components/Todo'
import { DataError } from '../components/DataError'

import { MdOutlineAdd, MdOutlineArrowBackIos } from 'react-icons/md'
import { FiTrash2 } from 'react-icons/fi'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from '@chakra-ui/react'

import styles from '../styles/id.module.scss'

const fetcher = (url: string) =>
  api
    .get(url, {
      params: {
        isCompleted: false,
      },
    })
    .then((res) => res.data)

export default function ProjectPage() {
  let todoRegEx: RegExp = /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/gm
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()

  const router = useRouter()
  const { id } = router.query
  const [todoName, setTodoName] = useState<string>('')

  //request for uncompleted to-do
  const {
    data: pendingTodoData,
    error: pendingTodoError,
    mutate: mutatePendingTodo,
  } = useSWR<Todo[]>(`/project/${id}/isPending`, fetcher)

  //request for completed to-do
  const {
    data: completedTodoData,
    error: completedTodoError,
    mutate: mutateCompletedTodo,
  } = useSWR<Todo[]>(`/project/${id}/isCompleted`, (url: string) =>
    api
      .get(url, {
        params: {
          isCompleted: true,
        },
      })
      .then((res) => res.data)
  )

  //SWR cache for optimistic UI
  const { mutate, cache } = useSWRConfig()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTodoName(e.target.value)
  }

  //POST request for add to-do
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      if (
        todoName.match(todoRegEx) &&
        todoName.length <= 50 &&
        todoName.trim() !== ''
      ) {
        api.post<Todo>(`/project/${id}`, { taskName: todoName }).then((res) => {
          const response = res.data as Todo
          mutatePendingTodo(
            [...(pendingTodoData ? pendingTodoData : []), response],
            false
          )
          setTodoName('')
        })
      } else {
        return
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [todoName, pendingTodoData, mutate]
  )

  //POST request for delete project inside it's page
  //Using POST instead of DELETE because i don't understand very well the other one.
  const handleDeleteProject = async () => {
    await api.post<Project>(`/delete/${id}`, { projectName: id }).then(() => {
      router.push('/')
    })
  }

  //POST request for delete specific to-do
  //Using POST instead of DELETE because i don't understand very well the other one.
  const handleDeleteTodo = async (todo: string, id: string) => {
    await api.post<Todo>(`/delete/todo/${todo}`, { todo: id }).then((res) => {
      if (cache instanceof Map) {
        const cachedTodo = cache.get(
          unstable_serialize(`/project${router.asPath}`)
        )
        if (res.data.completed) {
          mutateCompletedTodo(cachedTodo)
        } else {
          mutatePendingTodo(cachedTodo)
        }
      }
    })
  }

  //PATCH request for complete a to-do and pass it to 'Completed' list
  const toggleComplete: ToggleComplete = async (todo) => {
    await api.patch<Todo>(`/todo/${todo.id}`, {
      completed: !todo.completed,
    })

    if (cache instanceof Map) {
      const cachedTodo = cache.get(unstable_serialize(`/project/${id}`))
      mutatePendingTodo(cachedTodo)
      mutateCompletedTodo(cachedTodo)
    }
  }

  return (
    <div className={styles.projectPageWrapper}>
      <main className={styles.mainTodoContent}>
        <header className={styles.intro}>
          <h2 className={styles.name}>
            {' '}
            <Link href={'/'}>
              <a className={styles.previousPageButton}>
                <span>
                  <MdOutlineArrowBackIos size="24px" />
                </span>
              </a>
            </Link>
            <span>{id}</span>{' '}
          </h2>{' '}
          <button className={styles.deleteButton} onClick={onOpen}>
            <FiTrash2 size="28px" className={styles.deleteIcon} />
          </button>
        </header>

        <form className={styles.addTodo} onSubmit={handleSubmit}>
          <input
            type="text"
            name="taskName"
            value={todoName}
            onChange={handleChange}
            className={styles.todoInput}
            placeholder="Adicione uma tarefa"
          />
          <button className={styles.buttonAddTodo}>
            <MdOutlineAdd size="28px" />
            <span>Adicionar</span>
          </button>
        </form>

        <div
          className={`${styles.todoBox} ${
            !pendingTodoData ? styles.emptyTasks : ''
          }`}
        >
          {pendingTodoError || completedTodoError ? (
            <DataError />
          ) : !pendingTodoData || !completedTodoData ? (
            <div className={styles.ifEmpty}></div>
          ) : (
            <>
              <h3
                className={
                  pendingTodoData.length === 0 ? `${styles.emptyList}` : ''
                }
              >
                Pendentes - {pendingTodoData.length}
              </h3>
              <ul className={styles.todoList}>
                {pendingTodoData.map((pendingTodo) => {
                  return (
                    <Todo
                      key={pendingTodo.id}
                      todo={pendingTodo}
                      toggleComplete={() => toggleComplete(pendingTodo)}
                      handleDelete={() =>
                        handleDeleteTodo(pendingTodo.name, pendingTodo.id)
                      }
                    />
                  )
                })}
              </ul>

              <h3
                className={
                  completedTodoData.length === 0 ? `${styles.emptyList}` : ''
                }
              >
                Completas - {completedTodoData.length}
              </h3>
              <ul className={styles.todoList}>
                {completedTodoData.map((completedTodo) => {
                  return (
                    <Todo
                      key={completedTodo.id}
                      todo={completedTodo}
                      toggleComplete={() => toggleComplete(completedTodo)}
                      handleDelete={() =>
                        handleDeleteTodo(completedTodo.name, completedTodo.id)
                      }
                    />
                  )
                })}
              </ul>
            </>
          )}
        </div>
      </main>

      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
        size="sm"
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Excluir projeto
            </AlertDialogHeader>
            <AlertDialogBody className={styles.modalBodyText}>
              <p>
                Você está prestes a excluir um projeto. Após isso não terá
                qualquer forma de recuperá-lo.
              </p>
              <span>Está certo disso?</span>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                colorScheme="red"
                onClick={handleDeleteProject}
                mr={3}
                fontWeight={500}
                color="#fff"
              >
                Sim, estou
              </Button>
              <Button
                variant="ghost"
                onClick={onClose}
                fontWeight={500}
                color="#1a1a1a"
              >
                Talvez não
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  )
}
