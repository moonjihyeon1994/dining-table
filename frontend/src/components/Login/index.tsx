import * as React from 'react';
import styled from 'styled-components';
import KakaoLogin from 'react-kakao-login';
import GoogleLogin from 'react-google-login';
import { inject, observer } from 'mobx-react';
import { STORES } from '~constants';
import AuthStore from '~stores/auth/AuthStore';
import ModalStore from '~stores/modal/ModalStore';

export interface ILoginProps {
    authStore?: AuthStore;
    modalStore?: ModalStore;
}

@inject(STORES.AUTH_STORE, STORES.MODAL_STORE)
@observer
export default class Login extends React.Component<ILoginProps> {
    responseKakao = (res: any) => {
        this.props.authStore?.kakaoLogin(res.response.access_token);
        this.props.modalStore?.setToggle();
    }
    responseGoogle = (res: any) => {
        console.log("success");
        console.log(res);
    }
    responseFail = (err: any) => {
        console.log(err);
    }
    public render() {
        return (
            <LoginContainer>
                <StyledKakaoLogin
                    jsKey='694644aac704929dbb90e1e384b2540a'
                    // jsKey={process.env.REACT_APP_KAKAO_KEY}
                    onSuccess={this.responseKakao}
                    onFailure={this.responseFail}
                    buttonText={"Kakao"}
                    getProfile={true}
                    color={"white"}
                />
                <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_KEY+''}
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseFail}
                    cookiePolicy={'single_host_origin'}
                    render={renderProps => (
                        <StyledGoogleLogin onClick={renderProps.onClick} disabled={renderProps.disabled} color={"white"}>Google</StyledGoogleLogin>
                    )}
                    disabled
                />
            </LoginContainer>
        );
    }
}

const LoginContainer = styled.div`
    width: 100%;
    height: 40%;
    display: flex;
    justify-content: center;
    /* align-items: space-between; */
    /* flex-direction: column; */
`

const StyledKakaoLogin = styled(KakaoLogin)`
    width : 12rem;
    height: 8rem;
    color: #783c00;
    background-color: ${(props: { color: string }) => props.color};
    border: solid 1px;
    border-color: #FFEB00;
    border-radius: 10px;
    text-align: center;
    font-size: 14px;
    margin : auto;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 2px 2px 0px;
    &:hover{
        background-color: #FFEB00;
        -webkit-transition: background-color 250ms linear;
        -ms-transition: background-color 250ms linear;
        transition: background-color 250ms linear;
    }
`;

const StyledGoogleLogin = styled.button`
    width : 12rem;
    height: 8rem;
    background-color: ${(props: { color: string }) => props.color};
    border: solid 1px;
    border-radius: 10px;
    border-color: #DF0101;
    text-align: center;
    font-size: 14px;
    margin : auto;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 2px 2px 0px;
    &:hover{
        background-color: #DF0101;
        color: white;
        -webkit-transition: background-color 250ms linear;
        -ms-transition: background-color 250ms linear;
        transition: background-color 250ms linear;
    }
`;
