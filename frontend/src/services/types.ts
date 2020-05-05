import { AxiosResponse } from 'axios';

export interface Response<T> {
  data: T,
  msg?: string
}

export interface Res<T> {
  result: T,
  total_page?: number | undefined
}

export type ScoreRangeZeroToFive = 1 | 2 | 3 | 4 | 5;

export type ApiResponse<T> = AxiosResponse<Response<T>>;
export type Result<T> = AxiosResponse<Res<T>>;
