import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('タイトルが表示される', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'TODO' })).toBeInTheDocument();
  });

  it('初期状態では空メッセージが表示される', () => {
    render(<App />);

    expect(screen.getByText('TODOはまだありません')).toBeInTheDocument();
  });

  it('TODOを追加するとリストに表示される', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByPlaceholderText('新しいTODOを入力...'), '新しいタスク');
    await user.click(screen.getByRole('button', { name: '追加' }));

    expect(screen.getByText('新しいタスク')).toBeInTheDocument();
    expect(screen.queryByText('TODOはまだありません')).not.toBeInTheDocument();
  });

  it('TODOを追加するとLocalStorageに保存される', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByPlaceholderText('新しいTODOを入力...'), 'LS保存テスト');
    await user.click(screen.getByRole('button', { name: '追加' }));

    const stored = JSON.parse(localStorage.getItem('todos') ?? '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].text).toBe('LS保存テスト');
    expect(stored[0].completed).toBe(false);
  });

  it('チェックボックスをクリックするとTODOの完了状態が切り替わる', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByPlaceholderText('新しいTODOを入力...'), '完了テスト');
    await user.click(screen.getByRole('button', { name: '追加' }));

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('削除ボタンをクリックするとTODOがリストから消える', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByPlaceholderText('新しいTODOを入力...'), '削除テスト');
    await user.click(screen.getByRole('button', { name: '追加' }));
    expect(screen.getByText('削除テスト')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '削除' }));
    expect(screen.queryByText('削除テスト')).not.toBeInTheDocument();
  });

  it('複数のTODOを追加できる', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('新しいTODOを入力...');

    await user.type(input, 'タスク1');
    await user.click(screen.getByRole('button', { name: '追加' }));
    await user.type(input, 'タスク2');
    await user.click(screen.getByRole('button', { name: '追加' }));
    await user.type(input, 'タスク3');
    await user.click(screen.getByRole('button', { name: '追加' }));

    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.getByText('タスク2')).toBeInTheDocument();
    expect(screen.getByText('タスク3')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('LocalStorageにデータがある場合は起動時に復元される', () => {
    const existingTodos = [
      { id: 'pre-1', text: '既存タスク', completed: false, createdAt: 1700000000000 },
    ];
    localStorage.setItem('todos', JSON.stringify(existingTodos));

    render(<App />);

    expect(screen.getByText('既存タスク')).toBeInTheDocument();
  });
});
