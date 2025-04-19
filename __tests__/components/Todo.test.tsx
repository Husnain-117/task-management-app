import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Todo } from '@/types/todo';
import DashboardPage from '@/app/dashboard/page';

// Mock the useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Mock fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
) as jest.Mock;

describe('DashboardPage', () => {
  const mockTodos: Todo[] = [
    {
      id: 1,
      title: 'Test Todo',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'test-user',
    },
    {
      id: 2,
      title: 'Completed Todo',
      completed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'test-user',
    },
  ];

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders the dashboard page', () => {
    render(<DashboardPage />);
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument();
  });

  it('allows adding a new todo', async () => {
    render(<DashboardPage />);
    
    const input = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByText('Add Task');

    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.click(addButton);

    expect(global.fetch).toHaveBeenCalledWith('/api/tasks', 
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('New Todo'),
      })
    );
  });

  it('displays todos from the API', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      })
    );

    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Todo')).toBeInTheDocument();
      expect(screen.getByText('Completed Todo')).toBeInTheDocument();
    });
  });

  it('allows marking a todo as complete', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      })
    );

    render(<DashboardPage />);
    
    const checkbox = await screen.findByRole('checkbox', { name: /Test Todo/i });
    fireEvent.click(checkbox);

    expect(global.fetch).toHaveBeenCalledWith('/api/tasks', 
      expect.objectContaining({
        method: 'PUT',
        body: expect.stringContaining('"completed":true'),
      })
    );
  });

  it('allows deleting a todo', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      })
    );

    render(<DashboardPage />);
    
    const deleteButton = await screen.findByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/tasks?id='),
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('handles API errors gracefully', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('API Error'))
    );

    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('validates todo input before submission', async () => {
    render(<DashboardPage />);
    
    const input = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByText('Add Task');

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(addButton);

    expect(global.fetch).not.toHaveBeenCalled();
    expect(screen.getByText(/please enter a task/i)).toBeInTheDocument();
  });

  it('shows loading state while fetching todos', async () => {
    let resolvePromise: (value: any) => void;
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      new Promise((resolve) => {
        resolvePromise = resolve;
      })
    );

    render(<DashboardPage />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    resolvePromise!({
      ok: true,
      json: () => Promise.resolve(mockTodos),
    });

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });
}); 