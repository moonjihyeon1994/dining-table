import { DetailResponseDto } from "./../../services/ReviewService";
import ReviewService from "~services/ReviewService";
import { action, observable, toJS } from "mobx";
import autobind from "autobind-decorator";

export type ReviewCardModel = {
  id: number;
  store: number;
  user: number;
  score: number;
  content: string;
  reg_time: string;
  taste?: number;
  service?: number;
  price_satisfaction?: number;
  interior?: number;
  images: string[];
};

@autobind
class DetailStore {
  @observable storeId: number = 0;
  @observable reviewsTop3: ReviewCardModel[] = [];
  @observable reviewList: ReviewCardModel[] = [];
  @observable storeInfo: DetailResponseDto = {
    id: 1,
    store_name: "",
    area: "",
    tel: "",
    address: "",
    latitude: 0,
    longitude: 0,
    category: "",
    classification: "",
    price_mean: 0,
  };
  @observable test: number = 0;

  constructor(private reviewService: ReviewService) {}

  @action
  async init(v: number) {
    this.setStoreId(v);
    const res = await this.reviewService.getReview(v);

    for (const item of res.data.top3) {
      const getReviewImageData = await this.reviewService.getReviewImage(
        item.id
      );
      let fileUrlList: string[] = [];
      for (const innerItem of getReviewImageData.data) {
        fileUrlList.push(innerItem.file);
      }

      let temp: ReviewCardModel = {
        ...item,
        images: fileUrlList,
      };

      this.reviewsTop3.push(temp);
    }

    this.reviewService.getDetailInfo(v).then((res) => {
      this.storeInfo = res.data as DetailResponseDto;
    });

    for (const item of res.data.all) {
      const getReviewImageData = await this.reviewService.getReviewImage(
        item.id
      );
      let fileUrlList: string[] = [];
      for (const innerItem of getReviewImageData.data) {
        fileUrlList.push(innerItem.file);
      }
      let temp: ReviewCardModel = {
        ...item,
        images: fileUrlList,
      };

      this.reviewList.push(temp);
    }
  }

  @action
  setStoreId(v: number) {
    console.log(v);
    this.storeId = v;
  }

  @action
  getAllReviews(storeID: number) {
    return this.reviewList;
  }

  @action
  getReviewImages(reviewId: number) {
    return this.reviewService.getReviewImage(reviewId);
  }

  @action
  setTest(v: number) {
    this.test = v;
    // console.log(toJS(this.reviewList));
    // console.log(toJS(this.reviewsTop3));
  }
}

export default DetailStore;
