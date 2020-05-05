import axios from "axios";
import { ApiResponse } from "~services/types";
import { ScoreRangeZeroToFive } from "./types";

export type StoreResponseDto = {
  msg: string;
};

export type StoreRequestDto = {
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

const API_HOST = process.env.REACT_APP_API_HOST || "http://i02a306.p.ssafy.io:8080/api";

class FileService {
  async postRegReview(
    body: StoreRequestDto
  ): Promise<ApiResponse<StoreResponseDto>> {
    const formData = new FormData();
    formData.append("store", String(body.store));
    formData.append("user", String(body.user));
    formData.append("score", String(body.score));
    formData.append("content", body.content);
    formData.append("taste", String(body.taste));
    formData.append("service", String(body.service));
    formData.append("price_satisfaction", String(body.price_satisfaction));
    formData.append("interior", String(body.interior));
    if(body.file){
      for (const key of Object.keys(body.file)) {
        console.log(body.file[key]);
        formData.append("file",body.file[key]);
      }
    }
    // formData.append('file', );

    return axios.post(`${API_HOST}/reviews/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async getTest(): Promise<any> {
    console.log(API_HOST);
    return axios.get(`${API_HOST}/users`);
  }
}

export default FileService;
