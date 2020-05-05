import * as React from "react";
import styled from "styled-components";
import StarRating from "~components/StarRating";
import SimpleMapPage from "~components/GoogleMap";
import CircleImageView from "~components/CircleImageView";
import { HorizonWrapper } from "~css/Layout";
import { DetailResponseDto } from "~services/ReviewService";

export interface IDetailInfoProps {
  detailInfo: DetailResponseDto;
}

export default class DetailInfo extends React.Component<IDetailInfoProps> {
  public render() {
    const {
      address,
      area,
      category,
      classification,
      id,
      latitude,
      longitude,
      price_mean,
      store_name,
      tel,
    } = this.props.detailInfo;
    return (
      <StyledDetailInfoBackground>
        <StyledDetailInfo>
          <StyledDetailText>
            <h3>{classification}</h3>
            <h1>
              <b>{store_name}</b>
            </h1>
            <HorizonWrapper>
              <RatingTextWrapper>4.4</RatingTextWrapper>
              <EditFontStarRating rating={4.4} size={2}></EditFontStarRating>
            </HorizonWrapper>
            <HorizonWrapper>
              <div>
                <CircleImageViewWrapper>
                  <CircleImageView
                    src={
                      "https://cdn0.iconfinder.com/data/icons/seo-web-4-1/128/Vigor_Information-Info-Help-128.png"
                    }
                    size={1.5}
                  ></CircleImageView>
                </CircleImageViewWrapper>
              </div>
              <AddressTextWrapper>
                <h3>{address}</h3>
              </AddressTextWrapper>
            </HorizonWrapper>
          </StyledDetailText>
          <StyledDetailMap>
            <SimpleMapPage center={{lat:latitude, lng : longitude}} text={store_name}></SimpleMapPage>
          </StyledDetailMap>
        </StyledDetailInfo>
      </StyledDetailInfoBackground>
    );
  }
}

export const StyledDetailInfoBackground = styled.div`
  grid-area: detail;
  min-height: 30rem;
  max-height: 40rem;
  width: 100%;
  background-color: #fffaed;
  margin-top: 7rem;
`;

export const StyledDetailInfo = styled.div`
  position: relative;
  width: 70%;
  min-height: 40rem;
  max-height: 60rem;
  background-color: white;
  border-radius: 5px;
  padding: 4rem 3rem 4rem 3rem;
  margin: auto;
  margin-top: 3rem;
  box-shadow: 0 16px 24px 0px rgba(0, 0, 0, 0.04);
`;

const StyledDetailText = styled.div`
  float: left;
  width: 50%;
  min-height: 30rem;
`;

const StyledDetailMap = styled.div`
  float: left;
  width: 50%;
  height: 30rem;
  background-image: url("https://snazzy-maps-cdn.azureedge.net/assets/237264-no-labels.png?v=00010101120000");
  background-repeat: no-repeat;
  background-position: center;
  -webkit-background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  -o-background-size: 100% 100%;
  background-size: 100% 100%;
  box-shadow: 0 16px 24px 0px rgba(0, 0, 0, 0.04);
`;

const EditFontStarRating = styled(StarRating)`
  float: left;
  font-size: 3rem;
  padding-right: 0.6rem;
`;

const AddressTextWrapper = styled.div`
  float: left;
  padding-top: 0.4rem;
  padding-left: 1rem;
`;

const CircleImageViewWrapper = styled.div`
  float: left;
`;

const RatingTextWrapper = styled.div`
  float: left;
  font-size: 2rem;
  padding-right: 0.6rem;
`;
