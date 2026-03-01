import { useState } from 'react';
import styles from './TodoForm.module.css';

type Props = {
  onAdd: (text: string) => void;
};

export function TodoForm({ onAdd }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text);
    setText('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="新しいTODOを入力..."
      />
      <button className={styles.button} type="submit">
        追加
      </button>
    </form>
  );
}
