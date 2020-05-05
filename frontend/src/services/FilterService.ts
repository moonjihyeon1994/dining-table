import { ScoreRangeZeroToFive } from "./types";
import axios, {AxiosResponse} from "axios";

export type StoreResponseDto = {
  name: string;
  latitude: number;
  longitude: number;
  price_mean: number;
  store_id: number;
  score: ScoreRangeZeroToFive;
  classification: string;
  area: string;
  tel: string;
  address: string;
  taste: ScoreRangeZeroToFive;
  service: ScoreRangeZeroToFive;
  price_satisfaction: ScoreRangeZeroToFive;
  interior: ScoreRangeZeroToFive;
};

export type SidebarRequestDto = {
  type: "rating" | "recommend";
  price: number[];
  place: string[];
  category: string[];
  pageno? : number
};
const API_HOST = process.env.REACT_APP_API_HOST || "http://localhost:5000/api";

class FilterService {
  async getStoreList(
    body: SidebarRequestDto
  ): Promise<AxiosResponse<StoreResponseDto[]>> {
    return axios.post(`${API_HOST}/recommend-list`, body);
  }
}

export default FilterService;
