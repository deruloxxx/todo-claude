import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from '../TodoItem';
import type { Todo } from '../../types';

const baseTodo: Todo = {
  id: 'test-id-1',
  text: '牛乳を買う',
  completed: false,
  createdAt: 1700000000000,
};

describe('TodoItem', () => {
  it('未完了のTODOテキストとチェックボックスが表示される', () => {
    render(
      <TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText('牛乳を買う')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('完了済みのTODOはチェックボックスがチェックされている', () => {
    const completedTodo: Todo = { ...baseTodo, completed: true };
    render(
      <TodoItem todo={completedTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('チェックボックスをクリックするとonToggleが正しいidで呼ばれる', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <TodoItem todo={baseTodo} onToggle={onToggle} onDelete={vi.fn()} />
    );

    await user.click(screen.getByRole('checkbox'));

    expect(onToggle).toHaveBeenCalledWith('test-id-1');
  });

  it('削除ボタンをクリックするとonDeleteが正しいidで呼ばれる', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={onDelete} />
    );

    await user.click(screen.getByRole('button', { name: '削除' }));

    expect(onDelete).toHaveBeenCalledWith('test-id-1');
  });

  it('完了済みTODOのテキストに取り消し線スタイルが適用される', () => {
    const completedTodo: Todo = { ...baseTodo, completed: true };
    render(
      <TodoItem todo={completedTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
    );

    const textSpan = screen.getByText('牛乳を買う');
    expect(textSpan).toHaveClass('textCompleted');
  });

  it('未完了TODOのテキストには取り消し線スタイルが適用されない', () => {
    render(
      <TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
    );

    const textSpan = screen.getByText('牛乳を買う');
    expect(textSpan).toHaveClass('text');
    expect(textSpan).not.toHaveClass('textCompleted');
  });
});
