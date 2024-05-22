import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_ADDRESS,
});

export async function makeRequest<T>(
  endpoint: string,
  method: string = "GET",
  data: any = null,
  opt?: any
): Promise<T> {
  const options: AxiosRequestConfig = {
    url: endpoint,
    method,
    headers: {
      "Content-Type": "application/json",
    },
    data,
    ...opt,
  };

  try {
    const response: AxiosResponse<T> = await api(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw (error as AxiosError)?.response?.data;
  }
}
