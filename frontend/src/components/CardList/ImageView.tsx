import * as React from 'react';
import styled from 'styled-components';

export interface ImageViewProps {
    imageUrl : string,
}

const ImageView: React.FunctionComponent<ImageViewProps> = (props) => {
  return <StyledImageView imageUrl={props.imageUrl}></StyledImageView>;
};

const StyledImageView = styled.div`
    display: inline-block;
    background-image: url(${(props : ImageViewProps) => props.imageUrl});
    background-size: cover;
    margin: 1rem;
    height: 22rem;
    width: 22rem;
    border-radius: 5px;
`;

export default ImageView;
