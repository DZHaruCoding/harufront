import React, { useContext } from 'react';
import { Collapse, Navbar, NavItem, Nav, Button } from 'reactstrap';
import classNames from 'classnames';
import AppContext from '../../context/Context';
import Logo from './Logo';
import SearchBox from './SearchBox';
import TopNavRightSideNavItem from './TopNavRightSideNavItem';
import NavbarTopDropDownMenus from './NavbarTopDropDownMenus';
import { navbarBreakPoint, topNavbarBreakpoint } from '../../config';
import autoCompleteInitialItem from '../../data/autocomplete/autocomplete';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';

const NavbarTop = () => {
  const {
    showBurgerMenu,
    setShowBurgerMenu,
    isTopNav,
    isVertical,
    isCombo,
    navbarCollapsed,
    setNavbarCollapsed
  } = useContext(AppContext);
  const handleBurgerMenu = () => {
    isTopNav && !isCombo && setNavbarCollapsed(!navbarCollapsed);
    (isCombo || isVertical) && setShowBurgerMenu(!showBurgerMenu);
  };
  return (
    <Navbar
      light
      className="navbar-glass fs--1 font-weight-semi-bold row navbar-top sticky-kit"
      expand={isTopNav && topNavbarBreakpoint}
    >
      <div
        className={classNames('toggle-icon-wrapper mr-md-3 mr-2', {
          'd-lg-none': isTopNav && !isCombo,
          [`d-${navbarBreakPoint}-none`]: isVertical || isCombo
        })}
      >
        <button
          className="navbar-toggler-humburger-icon btn btn-link d-flex flex-center"
          onClick={handleBurgerMenu}
          id="burgerMenu"
        >
          <span className="navbar-toggle-icon">
            <span className="toggle-line" />
          </span>
        </button>
      </div>
      <Logo at="navbar-top" width={150} id="topLogo" />
      {isTopNav ? (
        <Collapse navbar isOpen={navbarCollapsed} className="scrollbar">
          <Nav navbar>
            <Button tag={Link} to="/" outline color={'info'} className="mr-2">
              프로젝트
            </Button>
            <Button tag={Link} to="/calendar" outline color={'info'} className="mr-2">
              캘린더
            </Button>
            <Button tag={Link} to="/kanban" outline color={'info'} className="mr-2">
              칸반차트
            </Button>
            {/* <Button tag={Link} color="outline-light" className="mt-2 px-4" to="/authentication/card/login"></Button> */}
            {/* <NavbarTopDropDownMenus setNavbarCollapsed={setNavbarCollapsed} /> */}
          </Nav>
        </Collapse>
      ) : (
        <Nav navbar className={`align-items-center d-none d-${topNavbarBreakpoint}-block`}>
          <NavItem>
            <SearchBox autoCompleteItem={autoCompleteInitialItem} />
          </NavItem>
        </Nav>
      )}

      <TopNavRightSideNavItem />
    </Navbar>
  );
};

export default NavbarTop;
