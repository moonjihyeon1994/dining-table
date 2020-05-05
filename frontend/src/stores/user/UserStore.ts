import AuthService from '~services/AuthService';
import { MypageResponseDto } from './../../services/AuthService';
import { action, observable } from 'mobx';
import autobind from 'autobind-decorator';

@autobind
class UserStore {
  @observable count = 0;
  @observable myPagePayload :MypageResponseDto | null = null;

  constructor(private authService : AuthService) {
      return ;
  }

  @action
  setMyPagePayload(v : MypageResponseDto) {
      this.myPagePayload = v;
  }
}

export default UserStore;
