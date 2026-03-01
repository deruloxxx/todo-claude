import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoForm } from '../TodoForm';

describe('TodoForm', () => {
  it('入力フィールドとボタンが表示される', () => {
    render(<TodoForm onAdd={vi.fn()} />);

    expect(screen.getByPlaceholderText('新しいTODOを入力...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument();
  });

  it('テキストを入力して追加ボタンを押すとonAddが呼ばれる', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoForm onAdd={onAdd} />);

    const input = screen.getByPlaceholderText('新しいTODOを入力...');
    await user.type(input, '買い物に行く');
    await user.click(screen.getByRole('button', { name: '追加' }));

    expect(onAdd).toHaveBeenCalledWith('買い物に行く');
  });

  it('追加後に入力フィールドがクリアされる', async () => {
    const user = userEvent.setup();
    render(<TodoForm onAdd={vi.fn()} />);

    const input = screen.getByPlaceholderText('新しいTODOを入力...');
    await user.type(input, 'テスト');
    await user.click(screen.getByRole('button', { name: '追加' }));

    expect(input).toHaveValue('');
  });

  it('Enterキーで送信できる', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoForm onAdd={onAdd} />);

    const input = screen.getByPlaceholderText('新しいTODOを入力...');
    await user.type(input, 'Enterで追加{Enter}');

    expect(onAdd).toHaveBeenCalledWith('Enterで追加');
  });

  it('空文字のみの場合はonAddが呼ばれない', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoForm onAdd={onAdd} />);

    await user.click(screen.getByRole('button', { name: '追加' }));

    expect(onAdd).not.toHaveBeenCalled();
  });

  it('スペースのみの場合はonAddが呼ばれない', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoForm onAdd={onAdd} />);

    const input = screen.getByPlaceholderText('新しいTODOを入力...');
    await user.type(input, '   ');
    await user.click(screen.getByRole('button', { name: '追加' }));

    expect(onAdd).not.toHaveBeenCalled();
  });
});
