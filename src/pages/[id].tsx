import Router, { useRouter } from 'next/router'
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import { Todo } from '../components/Todo'
import useSWR from 'swr'
import { useSWRConfig } from 'swr'
import api from '../services/api'

import { GrPrevious } from 'react-icons/gr'
import { MdDelete, MdOutlineAdd } from 'react-icons/md'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'

import styles from '../styles/id.module.scss'
import { DataError } from '../components/DataError'

const fetcher = (url: string) => api.get(url).then((res) => res.data)

export default function ProjectPage() {
  let todoRegEx: RegExp = /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/gm

  const { isOpen, onOpen, onClose } = useDisclosure()

  const router = useRouter()
  const { id } = router.query

  const [todoName, setTodoName] = useState<string>('')

  const {
    data: todoData,
    error,
    mutate,
  } = useSWR<Todo[]>(`/project/${id}`, fetcher)
  const { mutate: mutateTodo } = useSWRConfig()

  const toggleComplete: ToggleComplete = (name) => {
    console.log(name)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTodoName(e.target.value)
  }

  const handleDeleteProject = async () => {
    await api.post<Project>(`/delete/${id}`, { projectName: id }).then(() => {
      router.push('/')
    })
  }

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      if (todoName.match(todoRegEx) && todoName.length <= 50) {
        api.post<Todo>(`/project/${id}`, { taskName: todoName }).then((res) => {
          const response = res.data as Todo
          mutate([...(todoData ? todoData : []), response], false)
          setTodoName('')
        })
      } else {
        return
      }
    },
    [todoName, todoData, mutate]
  )

  const handleDeleteTodo = async (todo: string, id: string) => {
    await api.post<Todo>(`/delete/todo/${todo}`, { todo: id }).then((res) => {
      const response = res.data as Todo
      Router.reload()

      //TODO: ajustar pra não ter que dar reload nas rotas
    })
  }

  return (
    <div className={styles.projectPageWrapper}>
      <main className={styles.mainTodoContent}>
        <header className={styles.intro}>
          <h2 className={styles.name}>
            {' '}
            <button
              className={styles.previousPageButton}
              onClick={() => router.push('/')}
            >
              <span>
                <GrPrevious size="24px" color="red" />
              </span>
            </button>{' '}
            <span>{id}</span>{' '}
          </h2>{' '}
          <button className={styles.deleteButton} onClick={onOpen}>
            <MdDelete size="28px" className={styles.deleteIcon} />
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
            <span>
              <MdOutlineAdd size="32px" color="#fff" />
            </span>
          </button>
        </form>

        <div
          className={`${styles.todoBox} ${
            !todoData || todoData.length === 0 ? styles.emptyTasks : ''
          }`}
        >
          {error ? (
            <DataError />
          ) : !todoData || todoData.length === 0 ? (
            <div className={styles.ifEmpty}></div>
          ) : (
            <ul className={styles.todoList}>
              {todoData.map((todo) => {
                return (
                  <Todo
                    key={todo.id}
                    todo={todo}
                    toggleComplete={toggleComplete}
                    handleDelete={() => handleDeleteTodo(todo.name, todo.id)}
                  />
                )
              })}
            </ul>
          )}
        </div>
      </main>

      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> Certeza? </ModalHeader>
          <ModalCloseButton />
          <ModalBody className={styles.modalBodyText}>
            <p>
              Você está prestes a excluir um projeto. Após isso não terá
              qualquer forma de recuperá-lo.
            </p>
            <span>Está certo disso?</span>
          </ModalBody>

          <ModalFooter>
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
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
