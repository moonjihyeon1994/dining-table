import AuthService from '~services/AuthService';
import AuthStore from './auth/AuthStore';
import CounterStore from './counter/CounterStore';
import ModalStore from './modal/ModalStore';
import SidebarStore from './sidebar/SidebarStore';
import FilterService from '~services/FilterService';
import SearchbarStore from './searchbar/SearchbarStore';
import SearchbarService from '~services/SearchbarService';
import DetailStore from './detail/DetailStroe';
import ReviewService from '~services/ReviewService';
import UserStore from './user/UserStore';

export default class RootStore {
  static instance: RootStore;

  authStore = new AuthStore();
  counterStore = new CounterStore();
  modalStore = new ModalStore();
  sidebarStore = new SidebarStore(new FilterService());
  searchbarStore = new SearchbarStore(new SearchbarService());
  detailStore = new DetailStore(new ReviewService());
  userStore = new UserStore(new AuthService());
}
