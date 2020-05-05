import { ReviewCardModel } from '~stores/detail/DetailStroe';
import axios, { AxiosResponse } from 'axios';

export type SocialLoginResponseDto = {
  token: string;  // jwt
};

export type SocialLoginRequestDto = {
  access_token: string;
  provider: string;   // kakao, google
};

export type MypageResponseDto = {
  age: number;
  gender: string | null;
  grade: number;
  id: number;
  my_reviews: ReviewCardModel[];
  nickname: string | null;
  refresh_token: string | null;
  vendor: string;
};

const API_HOST = process.env.REACT_APP_API_HOST;

class AuthService {
  async socialLogin(body: SocialLoginRequestDto): Promise<AxiosResponse<SocialLoginResponseDto>> {
    return axios.post(`${API_HOST}/users/kakao`, body);
  }

  async socialUnlink(token : string | null){
    return axios.delete(`${API_HOST}/users/delete`, {
      headers: { "token": token },
    });
  }

  async reqGetMypage(token : string | null) : Promise<AxiosResponse<MypageResponseDto>>{
    return axios.get(`${API_HOST}/users/mypage`,{
      headers: {"token": token}
    });
  }
}

export default AuthService;
