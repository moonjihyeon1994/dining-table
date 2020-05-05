import { action, observable } from 'mobx';
import autobind from 'autobind-decorator';

@autobind
class ModalStore {
    @observable popup : boolean = false;
    @observable targetElement : React.ReactNode;
    @observable selectedRating : number = 3;
    @observable headerText : string = "미식단의 식탁에 오신걸 환영합니다";
    @observable size : ModalSize = {width: 350, height: 350};

    constructor() {
        return;
    }

    @action
    setToggle() {
        this.popup = !this.popup;
    }

    @action
    setTargetElement(el : React.ReactNode) {
        this.targetElement = el;
    }

    @action
    setSelectedRating(value : number) {
        this.selectedRating = value;
    }

    @action
    setHeaderText(value : string){
        this.headerText = value;
    }

    @action
    setSize(value : ModalSize){
        this.size = value;
    }

    @action
    handleClickRating(value : number, el : React.ReactNode){
        this.setSelectedRating(value);
        this.setTargetElement(el);
        this.setSize({width: 500, height : 0});
        this.setHeaderText("평가를 늘려 나만의 음식점 추천을 받아보세요!");
        this.setToggle();
    }

    @action
    handleClickLogin(el : React.ReactNode){
        this.setTargetElement(el);
        this.setSize({width: 350, height : 350});
        this.setHeaderText("소셜계정으로 간편하게 로그인하세요!");
        this.setToggle();
    }
}

export type ModalSize = {
    width: number,
    height: number
}

export default ModalStore;