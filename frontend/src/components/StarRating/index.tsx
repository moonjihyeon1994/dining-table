import * as React from 'react';
import StarRatingComponent from 'react-star-rating-component';
import styled from 'styled-components';

interface StarRatingProps{
  rating : number;
  editing? : boolean;
  size : number;
}

class StarRating extends React.Component<StarRatingProps> {
  state : {ratingState : number} = {
    ratingState: this.props.rating,
  }
 
  onStarClick(nextValue: number, prevValue:number, name:string) {
    this.setState({ratingState: nextValue});
  }
 
  render() {
    const { ratingState } = this.state;
    const { editing, size } = this.props;

    return (                
      <StarRatingWrapper size={size}>
        <StarRatingComponent 
          name="rate1" 
          editing={editing ? true : false}
          starCount={5}
          value={ratingState}
          onStarClick={this.onStarClick.bind(this)}
        />
      </StarRatingWrapper>
    );
  }
}

export default StarRating;

const StarRatingWrapper = styled.div`
  font-size : ${(props : {size : number}) => props.size + 'rem'};
`;