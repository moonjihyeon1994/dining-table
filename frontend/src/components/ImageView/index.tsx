import * as React from 'react';
import styled from 'styled-components';

export interface ImageViewProps {
    imageUrl : string,
    size : number,
    cover? : boolean,
    margin? : number
}

const ImageView: React.FunctionComponent<ImageViewProps> = (props) => {
  return <StyledImageView imageUrl={props.imageUrl} size={props.size} cover={props.cover} margin={props.margin}></StyledImageView>;
};

const StyledImageView = styled.div`
    display: inline-block;
    background-image: url(${(props : ImageViewProps) => props.imageUrl});
    background-size: cover;
    margin: ${(props: ImageViewProps)=> props.margin ? props.margin+'rem' : '0rem'};
    height: ${(props : {size : number, cover? : boolean}) => props.cover ? '100%' : props.size + 'rem'};
    width: ${(props : {size : number, cover? : boolean}) => props.cover ? '100%' : props.size + 'rem'};
    border-radius: 5px;
`;

export default ImageView;
