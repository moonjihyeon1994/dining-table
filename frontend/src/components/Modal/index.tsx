import * as React from "react";
import styled from "styled-components";

import { inject, observer } from "mobx-react";
import { STORES } from "~constants";
import ModalStore from "~stores/modal/ModalStore";
import Modal from "styled-react-modal";
import { IconContext } from "react-icons";
import { MdClose } from "react-icons/md";

import { theme } from "~css/theme";
import IconLogo from "~assets/img/iconLogo.jpeg";

import {ModalSize} from '~stores/modal/ModalStore';

export interface IModalProps {
  modalStore?: ModalStore;
  el: React.ReactNode;
}

export default inject(STORES.MODAL_STORE)(
  observer(({ modalStore, el }: IModalProps) => {
    const [opacity, setOpacity] = React.useState<number>(0);

    function afterOpen() {
      setTimeout(() => {
        setOpacity(1);
      }, 10);
    }

    function beforeClose() {
      return new Promise((resolve) => {
        setOpacity(0);
        setTimeout(resolve, 200);
      });
    }

    return (
      <WrapperModal
        isOpen={modalStore!.popup}
        afterOpen={afterOpen}
        beforeClose={beforeClose}
        onBackgroundClick={modalStore!.setToggle}
        onEscapeKeydown={modalStore!.setToggle}
        backgroundProps={{ opacity }}
        styledSize={modalStore!.size}
      >
        <ModalHeader>
          <Close>
            <IconContext.Provider value={{ size: "25" }}>
              <MdClose onClick={modalStore!.setToggle}>Close me</MdClose>
            </IconContext.Provider>
          </Close>
          <LogoImage />
          <TextWrapper>{modalStore?.headerText}</TextWrapper>
        </ModalHeader>
        {el}
      </WrapperModal>
    );
  })
);

// ${(props : {size : number})=> props.size+'rem'}

const StyledModal = Modal.styled`
  width: 35rem;
  height: 35rem;
  padding: 2rem;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.background};
  transition: opacity ease 500ms;
`;

const WrapperModal = styled(StyledModal)`
  width: ${(props: { styledSize: ModalSize }) =>
    props.styledSize.width > 0 ? props.styledSize.width + "px" : 350 + "px"};
  height: ${(props: { styledSize: ModalSize }) =>
    props.styledSize.height > 0 ? props.styledSize.height + "px" :  "auto"};
`;

const ModalHeader = styled.div`
  margin-bottom: auto;
  border-bottom: 1;
  width: 100%;
  position: relative;
`;

const TextWrapper = styled.div`
  text-align: center;
  padding: 2.5rem;
  width: 100%;
  float: left;
  font-size: 15px;
  font-weight: normal;
  color: ${theme.colors.textColor};
`;

const LogoImage = styled.div`
    margin: auto;
    width: 23rem;
    height: 10rem;
    background-image: url("${IconLogo}");
    background-position: center;
    background-size: cover;
`;

const Close = styled.div`
    text-align: right;
    margin-left: auto;
    right: 1rem;
`
