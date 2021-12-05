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
import { useRef, useState } from 'react'
import { GoKebabHorizontal } from 'react-icons/go'
import { MdEdit, MdDelete } from 'react-icons/md'

import styles from './todo.module.scss'

type TodoProps = {
  todo: Todo
  toggleComplete: ToggleComplete
  handleDelete: () => void
}

export function Todo({ todo, toggleComplete, handleDelete }: TodoProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()

  const [isChecked, setIsChecked] = useState<boolean>(false)

  const handleCheckbox = () => {
    setIsChecked((prevState) => !prevState)
    toggleComplete
  }

  return (
    <li className={`${styles.todo} ${isChecked ? styles.completed : ''}`}>
      <div className={styles.wrapper}>
        <div className={styles.todoCheckbox}>
          <Checkbox
            onChange={handleCheckbox}
            size="lg"
            borderColor="#4285f4"
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

      <button>
        <MdDelete size="24px" onClick={onOpen} />
      </button>

      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
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
