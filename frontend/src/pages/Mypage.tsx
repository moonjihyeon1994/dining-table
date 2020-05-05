import * as React from "react";
import { Layout } from "~css/Layout";
import Footer from "~components/Footer";
import NavBar from "~components/NavBar";
import MainContent from "~components/MainContent";
import styled from "styled-components";
import CircleImageView from "~components/CircleImageView";
import { theme } from "~css/theme";
import SlideBar from "~components/SlideBar";
import ReviewCardList from "~components/ReviewCardList";
import DetailCategory from "~components/DetailCategory";
import AuthService, { MypageResponseDto } from "~services/AuthService";
import { STORES } from "~constants";
import { inject, observer } from "mobx-react";
import AuthStore from "~stores/auth/AuthStore";
import UserStore from "~stores/user/UserStore";
import { ReviewCardModel } from '~stores/detail/DetailStroe';

export interface IMypageProps {
  authStore: AuthStore;
  userStore: UserStore;
}

export default inject(
  STORES.AUTH_STORE,
  STORES.USER_STORE
)(
  observer(({ authStore, userStore }: IMypageProps) => {
    const authservice = new AuthService();
    const handleDelete = () => {
      authservice.socialUnlink(window.sessionStorage.getItem("jwt"));
    };

    const [value, setValue] = React.useState<MypageResponseDto>();

    React.useEffect(() => {
      authStore
        .getMyPagePaylaod()
        .then((res) => {
          setValue(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);

    return (
      <LayoutWrapper>
        <NavBar />
        <WrapperTopBackground></WrapperTopBackground>
        <MainContent noPadding>
          <WrapperBox>
            <WrapperCircleImageView>
              <CircleImageView
                size={10}
                src={
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1024px-Circle-icons-profile.svg.png"
                }
              ></CircleImageView>
              <h1>{value?.nickname}</h1>
            </WrapperCircleImageView>
            <WrapperDetailHorizon>
              <WrapperDetailBox>
                <div>평가</div>
                <div>1</div>
              </WrapperDetailBox>
              <WrapperDetailBox>
                <div>레벨</div>
                <div>1</div>
              </WrapperDetailBox>
              <WrapperDetailBox>
                <div>좋아요</div>
                <div>1</div>
              </WrapperDetailBox>
            </WrapperDetailHorizon>
            {/* <WrapperSlideBar>
            <SlideBar
              labelText={"경험치"}
              alwaysTooltip
              min={0}
              max={100}
              notChange
              value={40}
            ></SlideBar>
            </WrapperSlideBar> */}

            <DetailCategory
              marginBottom={2}
              marginTop={1}
              size={1.5}
              text={"내가남긴 리뷰"}
            ></DetailCategory>

            { value ? value?.my_reviews.length > 0 ? (
              <ReviewCardList reviewList={value.my_reviews}></ReviewCardList>
            ) : (
              <WrapperCenterDiv>리뷰를 남겨주세요...</WrapperCenterDiv>
            ) : <WrapperCenterDiv>리뷰를 남겨주세요...</WrapperCenterDiv>}

            <WrapperCenterDiv>
              <StyledButton onClick={handleDelete}>탈퇴</StyledButton>
            </WrapperCenterDiv>
          </WrapperBox>
        </MainContent>
        <Footer></Footer>
      </LayoutWrapper>
    );
  })
);

const WrapperCenterDiv = styled.div`
  width: 100%;
  margin-top: 1rem;
  text-align: center;
`;

const StyledButton = styled.div`
  padding: 1rem;
  width: 50%;
  margin: auto;
  cursor: pointer;
  border: 1px solid ${theme.colors.mainColor};
  border-radius: 6px;
  color: ${theme.colors.mainColor};
`;

const LayoutWrapper = styled(Layout)`
  display: grid;
  grid-gap: 0.5rem;
  font-size: 1.5rem;
  grid-template-columns: 15% 69% 15%;
  grid-auto-rows: auto;
  grid-template-areas:
    "header header header"
    ". content ."
    ". content  ."
    "footer footer  footer";
`;

const WrapperTopBackground = styled.div`
  height: 50rem;
  width: 100%;
  position: absolute;
  top: 0;
  background-color: ${theme.colors.subColor2};
`;

const WrapperCircleImageView = styled.div`
  text-align: center;
  cursor: pointer;
`;

const WrapperBox = styled.div`
  background-color: white;
  border-radius: 10px;
  width: 100%;
  margin-top: 10rem;
  padding: 2rem;
  box-shadow: 0 0 15px 0 rgba(50, 50, 50, 0.3);
`;

const WrapperDetailHorizon = styled.div`
  text-align: center;
  width: 100%;
  display: inline-block;
`;

const WrapperDetailBox = styled.div`
  display: inline-block;
  margin: 1.5rem;
`;

const WrapperSlideBar = styled.div`
  margin: 2rem;
`;
