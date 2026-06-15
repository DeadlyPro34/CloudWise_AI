/**
 * Auth API service - calls backend /api/v1/auth/* endpoints.
 */

import { apiClient } from "./apiClient";
import type { TokenResponse, RegisterPayload, LoginPayload, User } from "../types";

export async function registerUser(payload: RegisterPayload): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>("/auth/register", payload);
  return data;
}

export async function loginUser(payload: LoginPayload): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>("/auth/login", payload);
  return data;
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<User>("/auth/me");
  return data;
}

export async function forgotPassword(email: string): Promise<{
  message: string;
  reset_token?: string;
  note?: string;
}> {
  const { data } = await apiClient.post("/auth/forgot-password", { email });
  return data;
}

export async function resetPassword(
  token: string,
  new_password: string
): Promise<{ message: string }> {
  const { data } = await apiClient.post("/auth/reset-password", { token, new_password });
  return data;
}

