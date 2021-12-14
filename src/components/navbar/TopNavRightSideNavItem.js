import React, { useContext } from 'react';
import { Button, Nav, NavItem, NavLink, UncontrolledTooltip } from 'reactstrap';
import ProfileDropdown from './ProfileDropdown';
import NotificationDropdown from './NotificationDropdown';
import SettingsAnimatedIcon from './SettingsAnimatedIcon';
import CartNotification from './CartNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import AppContext from '../../context/Context';
import classNames from 'classnames';
import { navbarBreakPoint } from '../../config';

const TopNavRightSideNavItem = () => {
  const { isTopNav, isCombo } = useContext(AppContext);
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
      )} */}
      {/* <CartNotification /> */}
      {/* <Button tag={Link} color="primary" size="sm" className="mt-3" to={`/authentication/basic/login`}>Login</Button> */}
      {/* 수정자 : 이승현 */}
              {window.sessionStorage.getItem("authUserEmail") ? 
              <Button tag={Link} color="primary" size="sm" className="mt-3" to={`/authentication/basic/logout`}>Logout</Button>
            : <Button tag={Link} color="primary" size="sm" className="mt-3" to={`/authentication/basic/login`}>Login</Button>
        }
      <NotificationDropdown />
      <ProfileDropdown />
    </Nav>
  );
};

export default TopNavRightSideNavItem;
