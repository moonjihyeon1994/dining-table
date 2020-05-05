import * as React from "react";
import styled from "styled-components";

export interface MainContentProps {
    children : React.ReactChild[] | React.ReactChild | React.ReactNode[]
    noPadding : boolean;
}

export default function SideBar(props: MainContentProps) {
  const {noPadding} = props;
  return (
    <MC noPadding={noPadding}>
        {props.children}
    </MC>
  );
}

export const MC = styled.div`
  grid-area: content;
  position: relative;
  padding-left : ${(props : {noPadding : boolean}) => props.noPadding ? 0 : '5rem'};
  padding-right : ${(props : {noPadding : boolean}) => props.noPadding ? 0 : '5rem'};
  margin-top: 10rem;
`;
