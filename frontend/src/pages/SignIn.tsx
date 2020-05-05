import * as React from 'react';

export interface SignInProps {
    test: number
}

export default class SignIn extends React.Component<SignInProps> {
  public render() {
    return (
      <div>
        SignIn Page
      </div>
    );
  }
}
