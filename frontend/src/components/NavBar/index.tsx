import * as React from "react";
import { RouteComponentProps } from "react-router";
import { MouseEvent } from "react";
import styled from "styled-components";
import { IconContext } from "react-icons";
import { MdSearch } from "react-icons/md";
import Modal from "~components/Modal";
import { ModalProvider, BaseModalBackground } from "styled-react-modal";

import { inject, observer } from "mobx-react";
import { STORES, PAGE_PATHS } from "~constants";
import ModalStore from "~stores/modal/ModalStore";
import SearchbarStore from "~stores/searchbar/SearchbarStore";
import AuthStore from "~stores/auth/AuthStore";

import { theme } from "~css/theme";
import Logo from "~assets/img/logo.jpeg";
import Login from "~components/Login";
import { Link } from "react-router-dom";

export interface INavProps {
  modalStore?: ModalStore;
  searchbarStore?: SearchbarStore;
  routeComponentProps?: RouteComponentProps;
  authStore?: AuthStore;
}

export default inject(STORES.MODAL_STORE, STORES.SEARCHBAR_STORE, STORES.AUTH_STORE)(
  observer(
    (navProps: INavProps) => {
      const goBack = (evt: MouseEvent) => {
        evt.preventDefault();
        evt.stopPropagation();
      };

      const [visible, setVisible] = React.useState(false);
      const [value, setValue] = React.useState("");

      // 서치바 함수
      const handleKeyPress = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
        navProps.searchbarStore?.setKeyword(event.target.value);
        navProps.searchbarStore?.makeAutocompleteList();
      }

      const enterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key == 'Enter') {
          navProps.searchbarStore?.getSearhList(1);
          setVisible(false);
          setValue("");
        }
      }

      const clickAutoComplete = () => {
        navProps.searchbarStore?.getSearhList(1);
        setVisible(false);
        setValue("");
      }

      const requestLogout = () => {
        navProps.authStore?.signOut();
      }

      // 자동완성 클릭이벤트함수
      const handleVisibleAutoRecommend = (event: React.FocusEvent<HTMLInputElement>) => {
        setVisible(true);
      }
      const handleUnvisibleAutoRecommend = (event: React.FocusEvent<HTMLInputElement>) => {
        setTimeout(() => {
          setVisible(false);
        }, 150);
      }

      return (
        <Nav>
          <StyledUl>
            <Link to={PAGE_PATHS.HOME}>
              <StyledLiLeft />
            </Link>
            <SearchLabel>
              <StyledIcon>
                <IconContext.Provider value={{ color: "#444" }}>
                  <MdSearch />
                </IconContext.Provider>
              </StyledIcon>
              <SearchBar
                type="search"
                placeholder="음식명, 지역명, 상호명을 입력해주세요."
                onChange={handleKeyPress}
                onKeyPress={enterKeyPress}
                onFocus={handleVisibleAutoRecommend}
                onBlur={handleUnvisibleAutoRecommend}
                value={value}
              />
              <RecommendBox id="RecommendBox" visible={visible}>
                {navProps.searchbarStore?.autocompleteList.map((element, i) => (
                  <RecommendItem
                    key={i}
                    onClick={clickAutoComplete}
                    onMouseOver={()=> setValue(element.sentence)}>
                    <RecommendType>{element.type}</RecommendType>
                    <RecommendSentence>{element.sentence} </RecommendSentence>
                  </RecommendItem>))
                  }
              </RecommendBox>
            </SearchLabel>
            {navProps.authStore!.isLoggedIn() ?
              <StyledLiRight onClick={() => navProps.modalStore!.handleClickLogin(<Login />)}>로그인</StyledLiRight>
              :
              <StyledLiRight>
                <WrapperLink to={PAGE_PATHS.MYPAGE}>
                <StyledSpan>마이페이지</StyledSpan>
                </WrapperLink>
                <StyledSpan onClick={requestLogout}>로그아웃</StyledSpan>
              </StyledLiRight>
            }
          </StyledUl>
          <ModalProvider backgroundComponent={SpecialModalBackground}>
            <Modal el={navProps.modalStore?.targetElement} />
          </ModalProvider>
        </Nav>
      );
    }
  )
);

const WrapperLink = styled(Link)`
  text-decoration: none;
  outline: none;
  &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
    }
`;

const SpecialModalBackground = styled(BaseModalBackground)`
  transition: opacity ease 200ms;
`;

const Nav = styled.div`
  z-index: 20;
  grid-area: header;
  background-color: ${theme.colors.background};
  color: ${theme.colors.mainColor};
  font-size: 2rem;
  font-weight: bold;
  padding: 1.3rem;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  grid-area: header;
  box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.06);
`;

const StyledUl = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style-type: none;
  margin: 0;
`;

const StyledLiLeft = styled.div`
  margin-right: auto;
  min-width: 15rem;
  padding: 1rem;
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  cursor: pointer;
  background-image: url("${Logo}");
    background-position: center;
    background-size: cover;
`;

const StyledLiRight = styled.div`
  margin-left: auto;
  min-width: 10rem;
  padding: 1rem;
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  cursor: pointer;
`;

const StyledSpan = styled.span`
  color: ${theme.colors.mainColor};
  padding: 0 1rem;
  
`;

const StyledIcon = styled.div`
  float: left;
  text-align: center;
  padding: 0rem 0.9rem 0rem 0.4rem;
`;

const SearchLabel = styled.label`
  background-color: white;
  margin: auto;
  padding: 1rem 1rem 1rem 1rem;
  border-radius: 6px;
  border-color: ${theme.colors.mainColor};
  border: solid 1px;
  min-width: 60rem;
`;

const SearchBar = styled.input`
  float: left;
  /* padding: auto; */
  /* margin: auto; */
  border-radius: 5px;
  font-size: 18px;
  border: 1px;
  width: 90%;
  outline: none;
  &:focus {
    #RecommendBox {
      visibility: visible;
    }
  }
`;

const RecommendBox = styled.div`
  z-index: 21;
  visibility: ${(props: { visible: boolean }) => props.visible ? 'visible' : 'hidden'};
  background-color: white;
  position: absolute;
  top: 60px;
  float: left;
  width: 580px;
  height: auto;
  padding: 1rem 0;
  color: ${theme.colors.textColor};
  font-size: 13px;
  font-weight: normal;
  border-radius: 6px;
`;

const RecommendItem = styled.div`
  padding: 0.3rem 1rem;
  &:hover {
    background-color: #aaaaaa;
  }
`

const RecommendType = styled.span`
  color: #cccccc;
  font-size: 12px;
  font-weight: normal;
  width: 60px; 
`

const RecommendSentence = styled.span`
  padding: 0 1rem;
  color: #222;
  font-size: 14px;
  font-weight: normal;
`






/*

 componentDidMount() {
    // 스크롤 이벤트 적용
    window.addEventListener('scroll', this.onScroll);
  }

  shouldComponentUpdate(nextProps, nextState) {
    //example 특정컴포넌트의 최상단(top)이 스크롤하여 가려져서 안보이게 되면(top<0) 특정 액션 실행하는 메소드
    const top = ReactDOM.findDOMNode(this).getBoundingClientRect().top;
    (top < 0) && 특정 액션 실행;
    return true;
  }


  onScroll = (e) => {
    // 스크롤 할때마다 state에 scroll한 만큼 scrollTop 값 증가하므로 이를 업데이트해줌,
    //따라서 스크롤 시점에 따라 특정액션을 추후에 state를 활용하여 구현 가능
    const scrollTop = ('scroll', e.srcElement.scrollingElement.scrollTop);
    this.setState({ scrollTop });
  };

*/
