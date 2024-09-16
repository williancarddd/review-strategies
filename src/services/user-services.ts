import { CreateUserDto, User } from '@/schemas/user-schema';
import apiClient from '@/lib/axios';

export async function createUser(data: CreateUserDto): Promise<User> {
  const response = await apiClient.post<User>('/users', data);
  return response.data;
}

export async function getUserById(id: string): Promise<User> {
  const response = await apiClient.get<User>(`/users/${id}`);
  return response.data;
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  const response = await apiClient.patch<User>(`/users/${id}`, data);
  return response.data;
}
