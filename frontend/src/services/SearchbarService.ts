import axios, { AxiosResponse }  from 'axios';
import { Result } from '~services/types';

const API_HOST = process.env.REACT_APP_API_HOST;

export type SearchResponseDto = {
    name: string;
    area: string;
    address: string;
    latitude: number;
    longitude: number;
    price_mean: number;
    store_id: number;
    score: number;
    classification: string;
    taste: number;
    service: number;
    price_satisfaction: number;
    interior: number;
}

export type RecommendDto = {
    type: string,
    sentence: string
}

class SearchbarService {
    async doSearch(type: string, sentence: string, page_no: number): Promise<Result<SearchResponseDto[]>> {
        return axios.get(`${API_HOST}/search/${type}/${sentence}/${page_no}/`);
    }

    async getAutocomplete(sentence: string): Promise<AxiosResponse<RecommendDto[]>> {
        return axios.get(`${API_HOST}/autocomplete/${sentence}/`);
    }
}

export default SearchbarService;