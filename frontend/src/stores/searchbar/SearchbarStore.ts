import { action, observable, toJS } from 'mobx';
import autobind from 'autobind-decorator';
import SearchService, { SearchResponseDto, RecommendDto } from '~services/SearchbarService';
import { throws } from 'assert';

@autobind
class SearchbarStore {
    @observable keyword: string = "";
    @observable autocompleteList: RecommendDto[] = [];
    @observable stores: SearchResponseDto[] = [];
    @observable store: SearchResponseDto = {} as SearchResponseDto;
    @observable type: string = "all";
    @observable totalpage: number = 1;
    @observable page: number = 1;
    @observable hasMore: boolean = false;

    constructor(private searchService: SearchService){

    }

    @action
    async getSearhList(page_no: number) {
        if(page_no == 1) {
            this.setStores([]);
            this.setHasMore(true);
        }
        const response = await this.searchService.doSearch(this.getType(), this.getKeyword(), page_no);
        this.setStores(this.getStores().concat(response.data.result));
        this.setTotalpage(response.data.total_page == undefined? 1 : response.data.total_page);
        this.nextPage();

        console.log(this.keyword+" "+this.type);
    }

    @action
    async makeAutocompleteList() {
        if(this.getKeyword() == "") {
            throws
        } else {
            const response = await this.searchService.getAutocomplete(this.getKeyword());
            this.setAutoCompleteList(response.data);
        }
    }

    @action
    getHasMore() {
        return this.hasMore;
    }

    @action
    setHasMore(hasm: boolean) {
        this.hasMore = hasm;
    }

    @action
    getKeyword() {
        return this.keyword;
    }

    @action
    setKeyword(value: string) {
        this.keyword = value;
    }

    @action
    getType() {
        return this.type;
    }

    @action
    setType(type: string) {
        this.type = type;
    }

    @action
    getStores() {
        return toJS(this.stores);
    }

    @action
    setStores(stores: SearchResponseDto[]) {
        this.stores = stores;
    }

    @action
    getTotalpage() {
        return this.totalpage;
    }

    @action
    setTotalpage(no: number) {
        this.totalpage = no;
    }

    @action
    getPage() {
        return this.page;
    }

    @action
    setPage(no: number) {
        this.page = no;
    }

    @action
    nextPage() {
        this.page += this.page;
    }

    @action
    getAutoCompleteList() {
        return toJS(this.autocompleteList);
    }

    @action
    setAutoCompleteList(autocompleteList: RecommendDto[]) {
        this.autocompleteList = autocompleteList;
    }
}

export default SearchbarStore;