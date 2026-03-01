import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoList } from '../TodoList';
import type { Todo } from '../../types';

const sampleTodos: Todo[] = [
  { id: 'id-1', text: '掃除する', completed: false, createdAt: 1700000000000 },
  { id: 'id-2', text: '洗濯する', completed: true, createdAt: 1700000001000 },
  { id: 'id-3', text: '料理する', completed: false, createdAt: 1700000002000 },
];

describe('TodoList', () => {
  it('TODOが空の場合は空メッセージが表示される', () => {
    render(<TodoList todos={[]} onToggle={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('TODOはまだありません')).toBeInTheDocument();
  });

  it('TODOが空の場合はリストが表示されない', () => {
    render(<TodoList todos={[]} onToggle={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('すべてのTODOが一覧表示される', () => {
    render(
      <TodoList todos={sampleTodos} onToggle={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText('掃除する')).toBeInTheDocument();
    expect(screen.getByText('洗濯する')).toBeInTheDocument();
    expect(screen.getByText('料理する')).toBeInTheDocument();
  });

  it('TODOがある場合はリスト要素が表示される', () => {
    render(
      <TodoList todos={sampleTodos} onToggle={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('チェックボックスをクリックすると対応するTODOのidでonToggleが呼ばれる', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <TodoList todos={sampleTodos} onToggle={onToggle} onDelete={vi.fn()} />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]);

    expect(onToggle).toHaveBeenCalledWith('id-2');
  });

  it('削除ボタンをクリックすると対応するTODOのidでonDeleteが呼ばれる', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <TodoList todos={sampleTodos} onToggle={vi.fn()} onDelete={onDelete} />
    );

    const deleteButtons = screen.getAllByRole('button', { name: '削除' });
    await user.click(deleteButtons[2]);

    expect(onDelete).toHaveBeenCalledWith('id-3');
  });

  it('完了済みTODOのチェックボックスはチェック状態になっている', () => {
    render(
      <TodoList todos={sampleTodos} onToggle={vi.fn()} onDelete={vi.fn()} />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).not.toBeChecked(); // 掃除する - 未完了
    expect(checkboxes[1]).toBeChecked();     // 洗濯する - 完了
    expect(checkboxes[2]).not.toBeChecked(); // 料理する - 未完了
  });
});
