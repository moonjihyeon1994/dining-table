import { toJS } from 'mobx';
import { MypageResponseDto } from './../../services/AuthService';
import { action, observable, reaction } from 'mobx';
import AuthService, { SocialLoginRequestDto } from '~services/AuthService';
import jwtDecode from 'jwt-decode';
import autobind from 'autobind-decorator';

export type User = {
  id: string,
  nickname: string,
  age: number,
  gender: string,
  grade: number,
  vender: string
}

export type Auth = {
  exp: string,
  user: User,
  access_token: string
}

@autobind
class AuthStore {
  @observable token: string | null = window.sessionStorage.getItem('jwt');
  @observable auth: Auth | undefined;
  @observable myPagePayload :MypageResponseDto | null = null;

  private authService = new AuthService();

  constructor() {
    if (this.token) {
      this.auth = jwtDecode(this.token) as Auth;
    }

    reaction(
      () => this.token,
      token => {
        if (token != null) window.sessionStorage.setItem('jwt', token);
      }
    );
  }

  isLoggedIn() {
    return this.token == null;
  }

  @action
  async kakaoLogin(access_token: string) {
    const body: SocialLoginRequestDto = {
      access_token: access_token,
      provider: "kakao"
    }
    await this.authService.socialLogin(body)
        .then((res)=> {
          console.log(res);
          window.sessionStorage.setItem('access_token',access_token);
          window.sessionStorage.setItem('jwt',res.data.token);
          this.setToken(res.data.token);
        });
  }

  @action
  getToken() {
    return this.token;
  }

  @action
  async getMyPagePaylaod(){
    console.log("init");
    return this.authService.reqGetMypage(this.getToken());
  }

  @action
  setToken(token: string) {
    this.token = token;
    this.auth = jwtDecode(token) as Auth;
  }

  @action
  signOut() {
        window.sessionStorage.removeItem('jwt');
        this.token = null;
        this.auth = undefined;
  }

  @action
  setMyPagePayload(v : MypageResponseDto) {
      this.myPagePayload = v;
  }
}

export default AuthStore;
