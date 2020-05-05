import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import Login from './pages/SignIn';
import PrivateRoute from './components/PrivateRouter';
import Counter from '~pages/Counter';
import Home from '~pages/Home';
import Detail from '~pages/Detail';
import Mypage from '~pages/Mypage';
import PrivatePage from '~pages/PrivatePage';
import { inject, observer } from 'mobx-react';
import autobind from 'autobind-decorator';
import { PAGE_PATHS, STORES } from '~constants';
import dotenv from 'dotenv';

dotenv.config();

@inject(STORES.AUTH_STORE)
@observer
@autobind
export default class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path={PAGE_PATHS.SIGNIN} component={Login} />
          <Route path={PAGE_PATHS.COUNTER} component={Counter} />
          <Route path={PAGE_PATHS.HOME} component={Home} />
          <Route path={PAGE_PATHS.DETAIL+"/:storeId"} component={Detail} />
          <PrivateRoute path={PAGE_PATHS.MYPAGE} component={Mypage} redirectTo={PAGE_PATHS.HOME} />
          <PrivateRoute path={PAGE_PATHS.PRIVATE} component={PrivatePage} redirectTo={PAGE_PATHS.HOME} />
          <Redirect from="/" to={PAGE_PATHS.HOME} />
        </Switch>
      </Router>
    );
  }
}
