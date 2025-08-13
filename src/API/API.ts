export type LoginResponse = { access_token: string };

export async function login(email: string, password: string): Promise<LoginResponse> {
  const API_BASE = process.env.NEXT_PUBLIC_HOST_API ?? 'http://localhost:3001';
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const msg = await safeReadText(res);
    throw new Error(msg || 'Login failed');
  }
  return (await res.json()) as LoginResponse;
}

export type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  flag_active: boolean;
  expiration_at: string | null;
  insert_at: string;
  update_at: string;
};

export async function getUsers(): Promise<User[]> {
  const API_BASE = process.env.NEXT_PUBLIC_HOST_API ?? 'http://localhost:3001';
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('access_token') : null;
  const res = await fetch(`${API_BASE}/users`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  if (!res.ok) {
    const msg = await safeReadText(res);
    throw new Error(msg || 'Failed to fetch users');
  }
  return (await res.json()) as User[];
}

export async function getUser(id: number): Promise<User> {
  const API_BASE = process.env.NEXT_PUBLIC_HOST_API ?? 'http://localhost:3001';
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('access_token') : null;
  const res = await fetch(`${API_BASE}/users/${id}`, {
    headers: { Authorization: token ? `Bearer ${token}` : '' },
  });
  if (!res.ok) {
    const msg = await safeReadText(res);
    throw new Error(msg || 'Failed to fetch user');
  }
  return (await res.json()) as User;
}

export type UpsertUserPayload = {
  email: string;
  password: string;
  name: string;
  flag_active: boolean;
  expiration_at?: string | null;
};

export async function createUser(payload: UpsertUserPayload): Promise<User> {
  const API_BASE = process.env.NEXT_PUBLIC_HOST_API ?? 'http://localhost:3001';
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('access_token') : null;
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const msg = await safeReadText(res);
    throw new Error(msg || 'Failed to create user');
  }
  return (await res.json()) as User;
}

export async function updateUser(id: number, payload: Partial<UpsertUserPayload>): Promise<User> {
  const API_BASE = process.env.NEXT_PUBLIC_HOST_API ?? 'http://localhost:3001';
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('access_token') : null;
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const msg = await safeReadText(res);
    throw new Error(msg || 'Failed to update user');
  }
  return (await res.json()) as User;
}

export async function deleteUser(id: number): Promise<void> {
  const API_BASE = process.env.NEXT_PUBLIC_HOST_API ?? 'http://localhost:3001';
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('access_token') : null;
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
    headers: { Authorization: token ? `Bearer ${token}` : '' },
  });
  if (!res.ok) {
    const msg = await safeReadText(res);
    throw new Error(msg || 'Failed to delete user');
  }
}

async function safeReadText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return '';
  }
}


