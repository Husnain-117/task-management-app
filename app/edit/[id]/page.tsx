'use client';

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save } from 'lucide-react';

export default function EditPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [todo, setTodo] = React.useState<{
    id: number;
    title: string;
    completed: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`/api/tasks?id=${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setTodo(data);
        setIsLoading(false);
      })
      .catch(() => router.push('/dashboard'));
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const updatedTodo = {
      id: parseInt(params.id),
      title: formData.get('title'),
      completed: formData.get('completed') === 'on',
    };

    const response = await fetch('/api/tasks', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodo),
    });

    if (response.ok) {
      router.push('/dashboard');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!todo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto animate-fade-in">
        <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl">
          <div className="mb-6 flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-primary-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-primary-900">Edit Task</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="id" value={todo.id} />
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">
                Task Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                defaultValue={todo.title}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  name="completed"
                  defaultChecked={todo.completed}
                  className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium">Mark as completed</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-primary-600 hover:bg-primary-700"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
} 