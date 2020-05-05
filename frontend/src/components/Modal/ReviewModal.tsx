import * as React from "react";
import styled from "styled-components";
import { theme } from "~css/theme";
import DetailCategory from "~components/DetailCategory";
import EditStarRating from "~components/StarRating/EditStarRating";
import SlideBar from "~components/SlideBar";
import fileService, {StoreRequestDto} from "~services/FileService";

export interface IReviewModalProps {}

export function ReviewModal(props: IReviewModalProps) {
  const [files, setFile] = React.useState<FileList | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files);
  };

  let b : StoreRequestDto = {
    store: 1,
    user: 7,
    score: 3,
    content: "string",
    taste: 2,
    service: 2,
    price_satisfaction: 2,
    interior: 2,
    file: null,
  };

  const handleClickPostReview = () => {
    let a = new fileService();
    b.file =files;
    console.log(b);
    a.postRegReview(b)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    })
  };
  return (
    <Wrapper>
      <DetailCategory
        marginBottom={1}
        marginTop={2}
        size={1.5}
        text={"별점"}
      ></DetailCategory>
      <WrapperRating>
        <EditStarRating size={30}></EditStarRating>
        <WrapperSlider>
          <SlideBar labelText="맛" min={1} max={5}></SlideBar>
          <SlideBar labelText="가격" min={1} max={5}></SlideBar>
          <SlideBar labelText="분위기" min={1} max={5}></SlideBar>
          <SlideBar labelText="서비스" min={1} max={5}></SlideBar>
        </WrapperSlider>
      </WrapperRating>
      <DetailCategory
        marginBottom={1}
        marginTop={2}
        size={1.5}
        text={"후기"}
      ></DetailCategory>
      <StyledTextarea></StyledTextarea>
      <DetailCategory
        marginBottom={1}
        marginTop={2}
        size={1.5}
        text={"이미지"}
      ></DetailCategory>
      <StyledUploadLabel>
        사진 첨부
        <StyledInputFile
          type="file"
          id="modal_file_upload"
          multiple
          onChange={handleFileChange}
        ></StyledInputFile>
      </StyledUploadLabel>
      {files?.length && files.length + "개의 사진"}
      <hr></hr>
      <WrapperBtn>
        <StyledBtnPrimary onClick={handleClickPostReview}>
          등록
        </StyledBtnPrimary>
      </WrapperBtn>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  color: black;
`;

const StyledTextarea = styled.textarea`
  font-size: 1.5rem;
  width: 100%;
  height: 12.5rem;
  border: 1px solid ${theme.colors.mainColor};
  border-radius: 6px;
  padding: 1rem;
  resize: none;
  -webkit-appearance: textarea;
`;

const StyledUploadLabel = styled.label`
  font-size: 1.5rem;
  border: 1px solid ${theme.colors.mainColor};
  padding: 1rem;
  border-radius: 6px;
  color: ${theme.colors.mainColor};
  cursor: pointer;
  margin: 1rem;
  &:hover {
    background-color: ${theme.colors.mainColor};
    transition: linear 300ms;
    color: white;
  }
`;

const StyledInputFile = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;

const StyledBtnPrimary = styled(StyledUploadLabel)`
  width: 100%;
  margin: 1rem 0 0 0;
`;

const WrapperBtn = styled.div`
  text-align: center;
`;

const WrapperRating = styled.div`
  text-align: center;
`;

const WrapperSlider = styled.div`
  width: 80%;
  margin: auto;
`;
