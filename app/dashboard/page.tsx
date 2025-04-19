'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Plus, CheckCircle2, Circle, Pencil, Trash2 } from 'lucide-react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [todos, setTodos] = useState<any[]>([]);
  const [newTask, setNewTask] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    fetchTasks();
  }, [session, router]);

  const fetchTasks = async () => {
    const response = await fetch('/api/tasks');
    if (response.ok) {
      const data = await response.json();
      setTodos(data);
    }
    setIsLoading(false);
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTask }),
    });

    if (response.ok) {
      setNewTask('');
      fetchTasks();
    }
  };

  const toggleTask = async (id: number, completed: boolean) => {
    const response = await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed: !completed }),
    });

    if (response.ok) {
      fetchTasks();
    }
  };

  const deleteTask = async (id: number) => {
    const response = await fetch(`/api/tasks?id=${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchTasks();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-900 mb-2">My Tasks</h1>
            <p className="text-gray-600">Welcome back, {session?.user?.name}</p>
          </div>

          <form onSubmit={addTask} className="mb-8 flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button type="submit" className="bg-primary-600 hover:bg-primary-700">
              <Plus className="w-5 h-5" />
              <span className="ml-2">Add Task</span>
            </Button>
          </form>

          <div className="space-y-3">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="group flex items-center gap-3 p-3 rounded-lg hover:bg-primary-50 transition-all animate-slide-in"
              >
                <button
                  onClick={() => toggleTask(todo.id, todo.completed)}
                  className="text-gray-400 hover:text-primary-600 transition-colors"
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-primary-600" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
                <span
                  className={`flex-1 ${
                    todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                  }`}
                >
                  {todo.title}
                </span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => router.push(`/edit/${todo.id}`)}
                    className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteTask(todo.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {todos.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No tasks yet. Add one above!
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
} 