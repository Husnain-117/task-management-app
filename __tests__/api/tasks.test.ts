import { GET, POST, DELETE, PUT } from '@/app/api/tasks/route';
import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';

// Mock Response for Next.js API routes
class MockResponse {
  constructor(body?: BodyInit | null, init?: ResponseInit) {
    return new Response(body, init);
  }
}

global.Response = MockResponse as any;

// Mock Request for Next.js API routes
class MockRequest implements Request {
  private _url: string;
  private options: RequestInit;
  public readonly cache: RequestCache;
  public readonly credentials: RequestCredentials;
  public readonly destination: RequestDestination;
  public readonly headers: Headers;
  public readonly integrity: string;
  public readonly keepalive: boolean;
  public readonly method: string;
  public readonly mode: RequestMode;
  public readonly redirect: RequestRedirect;
  public readonly referrer: string;
  public readonly referrerPolicy: ReferrerPolicy;
  public readonly signal: AbortSignal;
  public readonly body: ReadableStream | null;
  public readonly bodyUsed: boolean;

  constructor(input: string | Request, init?: RequestInit) {
    this._url = typeof input === 'string' ? input : input.url;
    this.options = init || {};
    this.cache = 'default';
    this.credentials = 'same-origin';
    this.destination = '' as RequestDestination;
    this.headers = new Headers(this.options.headers);
    this.integrity = '';
    this.keepalive = false;
    this.method = this.options.method || 'GET';
    this.mode = 'cors';
    this.redirect = 'follow';
    this.referrer = '';
    this.referrerPolicy = '';
    this.signal = new AbortController().signal;
    this.body = null;
    this.bodyUsed = false;
  }

  get url(): string {
    return this._url;
  }

  // Implement required Request methods
  async arrayBuffer(): Promise<ArrayBuffer> { throw new Error('Not implemented'); }
  async blob(): Promise<Blob> { throw new Error('Not implemented'); }
  async formData(): Promise<FormData> { throw new Error('Not implemented'); }
  async json(): Promise<any> { return JSON.parse(this.options.body as string); }
  async text(): Promise<string> { return this.options.body as string; }
  clone(): Request { return new MockRequest(this._url, this.options); }
  
  // Implement bytes() method
  async bytes(): Promise<Uint8Array> { throw new Error('Not implemented'); }
}

global.Request = MockRequest as any;

// Mock NextAuth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

// Mock Prisma
jest.mock('@/app/lib/prisma', () => ({
  prisma: {
    todo: {
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('Tasks API', () => {
  const mockSession = {
    user: { email: 'test@example.com' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
  });

  describe('GET /api/tasks', () => {
    it('returns tasks for authenticated user', async () => {
      const mockTasks = [
        { id: 1, title: 'Test Task', completed: false },
      ];
      (prisma.todo.findMany as jest.Mock).mockResolvedValue(mockTasks);

      const response = await GET();
      const data = await response.json();

      expect(data).toEqual(mockTasks);
      expect(prisma.todo.findMany).toHaveBeenCalledWith({
        where: { userId: mockSession.user.email },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('returns 401 when not authenticated', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const response = await GET();
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/tasks', () => {
    it('creates a new task', async () => {
      const mockTask = { title: 'New Task' };
      const request = new Request('http://localhost/api/tasks', {
        method: 'POST',
        body: JSON.stringify(mockTask),
      });

      await POST(request);

      expect(prisma.todo.create).toHaveBeenCalledWith({
        data: {
          title: mockTask.title,
          userId: mockSession.user.email,
        },
      });
    });
  });

  describe('DELETE /api/tasks', () => {
    it('deletes a task', async () => {
      const taskId = '1';
      const request = new Request(`http://localhost/api/tasks?id=${taskId}`);

      await DELETE(request);

      expect(prisma.todo.delete).toHaveBeenCalledWith({
        where: {
          id: parseInt(taskId),
          userId: mockSession.user.email,
        },
      });
    });
  });

  describe('PUT /api/tasks', () => {
    it('updates a task', async () => {
      const mockUpdate = { id: '1', title: 'Updated Task', completed: true };
      const request = new Request('http://localhost/api/tasks', {
        method: 'PUT',
        body: JSON.stringify(mockUpdate),
      });

      await PUT(request);

      expect(prisma.todo.update).toHaveBeenCalledWith({
        where: {
          id: parseInt(mockUpdate.id),
          userId: mockSession.user.email,
        },
        data: {
          title: mockUpdate.title,
          completed: mockUpdate.completed,
        },
      });
    });
  });
}); 