import type { Todo } from '../types';
import styles from './TodoItem.module.css';

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <li className={styles.item}>
      <label className={styles.label}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <span className={todo.completed ? styles.textCompleted : styles.text}>
          {todo.text}
        </span>
      </label>
      <button
        className={styles.deleteButton}
        onClick={() => onDelete(todo.id)}
        aria-label="削除"
      >
        &times;
      </button>
    </li>
  );
}
