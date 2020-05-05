import axios, { AxiosResponse } from "axios";
import { ScoreRangeZeroToFive } from "./types";

export type ReviewResponseDetailDto = {
  content: string;
  id: number;
  interior: ScoreRangeZeroToFive;
  price_satisfaction: number;
  reg_time: string;
  score: number;
  service: number;
  store: number;
  taste: number;
  user: number;
};

export type ReviewResponseDto = {
  all: ReviewResponseDetailDto[];
  top3: ReviewResponseDetailDto[];
};

export type ReviewRequestDto = {
  store: number;
  user: number;
  score: ScoreRangeZeroToFive;
  content: string;
  taste: ScoreRangeZeroToFive;
  service: ScoreRangeZeroToFive;
  price_satisfaction: ScoreRangeZeroToFive;
  interior: ScoreRangeZeroToFive;
  file: FileList | null;
};

export type ReviewImageDto = {
  id: number;
  file: string;
  review: number;
};

export type DetailResponseDto = {
  id: number;
  store_name: string;
  area: string;
  tel: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  classification: string;
  price_mean: number;
};

const API_HOST = process.env.API_HOST || "http://i02a306.p.ssafy.io:8080/api";

class ReviewService {
  async getTest(): Promise<any> {
    console.log(API_HOST);
    return axios.get(`${API_HOST}/users`);
  }

  async getReview(
    storeId: number | string
  ): Promise<AxiosResponse<ReviewResponseDto>> {
    return axios.get(`${API_HOST}/reviews/store/${storeId}/`);
  }

  async getReviewImage(
    review_id: number
  ): Promise<AxiosResponse<ReviewImageDto[]>> {
    return axios.get(`${API_HOST}/reviews/images/${review_id}/`);
  }

  async getDetailInfo(storeId : number) : Promise<AxiosResponse<DetailResponseDto>> {
      return axios.get(`${API_HOST}/stores/${storeId}`);
  }
}

export default ReviewService;
