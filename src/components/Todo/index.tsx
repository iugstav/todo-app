import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import api from '../../services/api'
import useSWR from 'swr'
import { Checkbox } from '@chakra-ui/checkbox'
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
import { FiTrash2 } from 'react-icons/fi'

import styles from './todo.module.scss'

type TodoProps = {
  todo: Todo
  toggleComplete: ToggleComplete
  handleDelete: () => void
}

export function Todo({ todo, toggleComplete, handleDelete }: TodoProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()

  const handleCheckbox = () => {
    toggleComplete(todo)
  }

  return (
    <li className={`${styles.todo} ${todo.completed ? styles.completed : ''}`}>
      <div className={styles.wrapper}>
        <div className={styles.todoCheckbox}>
          <Checkbox
            onChange={handleCheckbox}
            isChecked={todo.completed}
            size="lg"
            borderColor="purple.400"
            colorScheme="purple"
            marginLeft="0.8rem"
            spacing="1rem"
            iconColor="#ffffff"
            iconSize="1rem"
            aria-label="Completar a tarefa"
          >
            <span className={styles.text}> {todo.name} </span>
          </Checkbox>
        </div>
      </div>

      <button className={styles.deleteTodoButton} onClick={onOpen}>
        <FiTrash2 size="24px" className={styles.deleteTodoIcon} />
      </button>

      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
        size="sm"
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Excluir tarefa
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza? Não poderá recuperar essa tarefa depois.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                colorScheme="red"
                onClick={() => {
                  handleDelete()
                  onClose()
                }}
                mr={3}
                fontWeight={500}
              >
                Sim, tenho
              </Button>
              <Button
                ref={cancelRef}
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
    </li>
  )
}
