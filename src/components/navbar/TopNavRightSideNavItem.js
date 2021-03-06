import React, { useContext } from 'react';
import { Button, Nav, NavItem, NavLink, UncontrolledTooltip } from 'reactstrap';
import ProfileDropdown from './ProfileDropdown';
import NotificationDropdown from './NotificationDropdown';
// import SettingsAnimatedIcon from './SettingsAnimatedIcon';
// import CartNotification from './CartNotification';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import AppContext, { ProfileContext } from '../../context/Context';
// import classNames from 'classnames';
import { localIp, navbarBreakPoint } from '../../config';
import ProfileProvider from '../auth/ProfileProvider';


const TopNavRightSideNavItem = () => {
  const { isTopNav, isCombo } = useContext(AppContext);

  // const test = async e => {
  //   try {
  //     const response = await fetch('/haru/api/user/test', {
  //       method: 'get'
  //     })

  //     if (!response.ok) {
  //       throw new Error(`${response.status} ${response.statusText}`)
  //     }

  //     console.log(response.data);

  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  const Logout = async e => {
    sessionStorage.clear();
    try {
      const response = await fetch(`/haru/api/logout`, {
        method: 'get'
      })

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`)
      }

      console.log("๋ก๊ทธ์์!!")

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Nav navbar className="navbar-nav-icons ml-auto flex-row align-items-center">
      <NavItem>
        {/* <SettingsAnimatedIcon /> */}
      </NavItem>
     {/* {(isCombo || isTopNav) && (
        <NavItem className={classNames(`p-2 px-lg-0 cursor-pointer`, { [`d-${navbarBreakPoint}-none`]: isCombo })}>
          <NavLink tag={Link} to="/changelog" id="changelog">
            <FontAwesomeIcon icon="code-branch" transform="right-6 grow-4" />
          </NavLink>
          <UncontrolledTooltip autohide={false} placement="left" target="changelog">
            Changelog
          </UncontrolledTooltip>
        </NavItem>
      )}  */}
      {/* <CartNotification /> */}
      {/* ์์?์ : ์ด์นํ  to={`/authentication/basic/logout`*/}
      {window.sessionStorage.getItem("authUserEmail") ?
        <Button tag={Link} color="primary" size="sm" className="mt-3" onClick={Logout} to={`/authentication/basic/logout`}>Logout</Button>
        : <Button tag={Link} color="primary" size="sm" className="mt-3" to={`/`}>Login</Button>
      }
      <NotificationDropdown />
        <ProfileDropdown /> 
    </Nav>
  );
};

export default TopNavRightSideNavItem;
