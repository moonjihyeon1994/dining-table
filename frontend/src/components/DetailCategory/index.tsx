import * as React from 'react';
import styled from 'styled-components';

export interface IDetailCategoryProps {
    text : string;
}

export default class DetailCategory extends React.Component<IDetailCategoryProps & Wrapper> {
  public render() {
    return (
      <Wrapper size={this.props.size} marginTop={this.props.marginTop} marginBottom={this.props.marginBottom}>
        <b>{this.props.text}</b>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
    font-size : ${(props : Wrapper) => props.size! +'rem'};
    margin-top: ${(props : Wrapper) => props.marginTop! + 'rem'};
    margin-left : 1rem;
    margin-bottom : ${(props : Wrapper) => props.marginBottom! + 'rem'};
`;

type Wrapper = {
  size : number,
  marginTop : number,
  marginBottom : number
}