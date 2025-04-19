import { render, screen, fireEvent } from '@testing-library/react';
import { Todo } from '@/types/todo';
import DashboardPage from '@/app/dashboard/page';

// Mock the useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
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
  ];

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders the dashboard page', () => {
    render(<DashboardPage />);
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
  });

  it('allows adding a new todo', async () => {
    render(<DashboardPage />);
    
    const input = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByText('Add Task');

    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.click(addButton);

    expect(global.fetch).toHaveBeenCalledWith('/api/tasks', expect.any(Object));
  });

  it('displays todos from the API', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      })
    );

    render(<DashboardPage />);
    
    // Wait for todos to be displayed
    const todoTitle = await screen.findByText('Test Todo');
    expect(todoTitle).toBeInTheDocument();
  });

  it('allows marking a todo as complete', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      })
    );

    render(<DashboardPage />);
    
    const checkbox = await screen.findByRole('checkbox');
    fireEvent.click(checkbox);

    expect(global.fetch).toHaveBeenCalledWith('/api/tasks', expect.any(Object));
  });
}); 