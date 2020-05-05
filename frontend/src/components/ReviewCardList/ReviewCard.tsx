import * as React from "react";
import styled from "styled-components";
import CircleImageView from "~components/CircleImageView";
import StarRating from "~components/StarRating";
import ImageView from "~components/ImageView";
import dayjs from 'dayjs';
import {AiOutlineLike, AiTwotoneLike} from 'react-icons/ai';
import { ReviewCardModel } from '~stores/detail/DetailStroe';

export interface IReviewCardProps {
  review : ReviewCardModel;
}

const test = '안녕 \n클레오 \n파트라 ';

export default function ReviewCard(props: IReviewCardProps) {
  const { user ,content, id, interior, price_satisfaction, reg_time, score, service ,store, images } = props.review;
  const imagesMap = images!.map(item => {
    return <StyledImageView imageUrl={item} size={10} margin={1} />
  });
  return (
    <WrapperReviewCard>
      <WrapperProfile>
        <CircleImageView
          src={
            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1024px-Circle-icons-profile.svg.png"
          }
          size={3}
        />
        <WrapperProfieInfo>
          {user}
          <WrapperStarRatingDiv>
            <StarRating rating={score} size={2} />
            <WrapperText>{ dayjs(reg_time).format('YYYY-MM-DD HH:mm') }</WrapperText>
            
          </WrapperStarRatingDiv>
        </WrapperProfieInfo>
      </WrapperProfile>
      <WrapperReviewComment>
          <pre>
          {content}
          </pre>
        </WrapperReviewComment>
        {imagesMap}

    </WrapperReviewCard>
  );
}

const WrapperReviewCard = styled.div`
  width: auto;
  min-height: 20rem;
  max-height: 30rem;
  width: 100%;
  padding: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 28px 0 rgba(30, 30, 30, 0.08);
  overflow: hidden;
`;

const WrapperProfile = styled.div`
  display: flex;
`;

const WrapperProfieInfo = styled.div`
  margin-left: 1rem;
`;

const WrapperStarRatingDiv = styled.div`
  display: flex;
  vertical-align: middle;
`;

const WrapperText = styled.div`
  vertical-align: middle;
  font-size: 2rem;
  margin-left: 1rem;
  color: #a3a3a3;
`;

const WrapperReviewComment = styled.div`
  display: block;
  padding: 1rem;
`;

const StyledImageView = styled(ImageView)`

`

const WrapperIcon = styled.div`
  font-size: 2rem;
`;