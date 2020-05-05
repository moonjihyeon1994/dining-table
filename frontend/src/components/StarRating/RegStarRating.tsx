import React from "react";
import ReactDOM from "react-dom";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap_white.css";
import Rate from "rc-rate";
import styled from "styled-components";
import "./StarRating.less";
import { inject, observer } from 'mobx-react';
import { STORES } from '~constants';
import ModalStore from '~stores/modal/ModalStore';
import {ReviewModal} from '~components/Modal/ReviewModal';

const StyledRate = styled(Rate)`
  &.rc-rate {
    font-size: ${(props: { size: number }) => props.size}px;
  }
`;

const tootipString = [
  "다시 가고 싶지 않아요...",
  "그냥 그래요",
  "보통이었요",
  "맛있습니다!",
  "맨날 가고 싶어요!",
];

interface IStarRatingProps {
    modalStore? : ModalStore;
    size : number;
}

export default inject(STORES.MODAL_STORE)(
  observer(({modalStore, size} : IStarRatingProps) => {

    const handleChange = (value : number) => {
      // alert(`${value} mobx 언제 연결해...`);
      modalStore!.handleClickRating(value, <ReviewModal />);
    }
    return (
      <div>
        <StyledRate
          size= {size}
          defaultValue={3}
          onChange={handleChange}
          characterRender={(node, props) => (
            <Tooltip placement="bottom" overlay={tootipString[props.index!]}>
              {node}
            </Tooltip>
          )}
        />
      </div>
    )}
));

// export default function StarRate(props: IStarRatingProps) {
//   return (
//     <div>
//       <StyledRate
//         size= {props.size}
//         defaultValue={3}
//         onChange={handleChange}
//         characterRender={(node, props) => (
//           <Tooltip placement="bottom" overlay={tootipString[props.index!]}>
//             {node}
//           </Tooltip>
//         )}
//       />
//     </div>
//   );
// }
