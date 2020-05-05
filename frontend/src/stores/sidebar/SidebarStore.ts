import { SidebarRequestDto } from "./../../services/FilterService";
import { action, observable, toJS } from "mobx";
import autobind from "autobind-decorator";
import FilterService from "~services/FilterService";

@autobind
class SidebarStore {
  @observable type: "rating" | "recommend" = "recommend";
  @observable price: number[] = [5000, 15000];
  @observable place: string[] = ["강남","이태원"];
  serachedPlace: string[] = [];
  // @observable hotPlace: string[] = [];
  @observable isCategoriesClick: boolean[] = [
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
  @observable inputSearchText: string = "";
  @observable page : number = 1;
  @observable selectedPlaces : Object = {};
  @observable hotPlaces = ["강남", "이태원", "홍대입구", "가로수길", "익선동", "압구정", "신촌"];

  constructor(private filterService: FilterService) {}

  @action
  addSelectedPlaces(v : string) {
    this.selectedPlaces[v]=true;
  }

  @action
  deleteSelectePlaces(v : string){
    delete this.selectedPlaces[v];
  }

  @action
  setType(filterTypeValue: number) {
    this.type = filterTypeValue ? "rating" : "recommend";
    this.reqGetStoreList();
  }

  @action
  setPrice(filterPriceValue: number[]) {
    observable(this.price).replace(filterPriceValue);
    this.reqGetStoreList();
  }

  @action
  searchListAutoComplate(filterSearchValue: string) {
    this.inputSearchText = filterSearchValue;
    this.serachedPlace = [];
    this.serachedPlace = this.place.filter(
      (item) => item.indexOf(filterSearchValue) >= 0
    );
  }

  @action
  setCategoriesClick(filterClikedCategoryIndex: number) {
    this.isCategoriesClick[filterClikedCategoryIndex] = !this.isCategoriesClick[
      filterClikedCategoryIndex
    ];
    this.reqGetStoreList();
  }

  @action
  reqGetStoreList() {
    const categories: string[] = [
      "한식",
      "일식",
      "양식",
      "중식",
      "뷔페",
      "까페",
      "주점",
      "세계음식",
    ];
    const temp: string[] = [];
    let idx = 0;
    for (const key of this.isCategoriesClick) {
      if (key) {
        temp.push(categories[idx]);
      }
      idx++;
    }
    const param: SidebarRequestDto = {
      type: toJS(this.type),
      price: toJS(this.price),
      place: toJS(this.place),
      category: temp,
      pageno : toJS(this.page)
    };
    // const param: SidebarRequestDto = {
    //   type: "recommend",
    //   price: [5000, 15000],
    //   place: ["강남", "역삼"],
    //   category: ["한식", "일식"],
    // };
    console.log(param);
    const res = this.filterService.getStoreList(param);
    res.then(r => console.log(r));
  }

  @action
  getType() {
    return this.type;
  }
}

export default SidebarStore;
