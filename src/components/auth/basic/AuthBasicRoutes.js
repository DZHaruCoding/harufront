import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import Login from './Login';
import Logout from './Logout';
import Registration from './Registration';
import ForgetPassword from './ForgetPassword';
import PasswordReset from './PasswordReset';
import ConfirmMail from './ConfirmMail';
import LockScreen from './LockScreen';
import Logoutchange from './Logoutchange'
import AfterDeleteUser from '../AfterDeleteUser'

const AuthBasicRoutes = ({ match: { url } }) => (
  <Switch>
    <Route path={`/`} exact component={Login} />
    <Route path={`/authentication/basic/logout`} exact component={Logout} />
    <Route path={`/authentication/basic/register`} exact component={Registration} />
    <Route path={`/authentication/basic/forget-password`} exact component={ForgetPassword} />
    <Route path={`/authentication/basic/confirm-mail`} exact component={ConfirmMail} />
    <Route path={`/authentication/basic/password-reset`} exact component={PasswordReset} />
    <Route path={`/authentication/basic/lock-screen`} exact component={LockScreen} />
    <Route path={`/authentication/basic/change-password`} exact component={Logoutchange} />
    <Route path={`/authentication/basic/delete-user`} exact component={AfterDeleteUser} />

    {/*Redirect*/}
    <Redirect to="/errors/404" />
  </Switch>
);

AuthBasicRoutes.propTypes = { match: PropTypes.object.isRequired };

export default withRouter(AuthBasicRoutes);
