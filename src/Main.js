import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AppContext from './context/Context';
import { settings } from './config';
import toggleStylesheet from './helpers/toggleStylesheet';
import { getItemFromStore, setItemToStore, themeColors } from './helpers/utils';
//fluid는 가로 해상도에 상관없이 100%의 width를 갖는다. 말그대로 Layout 설정이다. 다른 예시로는 fixed 가 있고 이는 Media query에 의해 반응형을 동작하는 layout이다.
const Main = props => {
  const [isFluid, setIsFluid] = useState(getItemFromStore('isFluid', settings.isFluid));
  const [isRTL, setIsRTL] = useState(getItemFromStore('isRTL', settings.isRTL));
  const [isDark, setIsDark] = useState(getItemFromStore('isDark', settings.isDark));
  const [isTopNav, setIsTopNav] = useState(getItemFromStore('isTopNav', settings.isTopNav));
  const [isCombo, setIsCombo] = useState(getItemFromStore('isCombo', settings.isCombo));
  // const [isVertical, setIsVertical] = useState(getItemFromStore('isVertical', settings.isVertical));
  const [isNavbarVerticalCollapsed, setIsNavbarVerticalCollapsed] = useState(
    getItemFromStore('isNavbarVerticalCollapsed', settings.isNavbarVerticalCollapsed)
  );
  const [currency, setCurrency] = useState(settings.currency);
  const [showBurgerMenu, setShowBurgerMenu] = useState(settings.showBurgerMenu);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpenSidePanel, setIsOpenSidePanel] = useState(false);
  const [navbarCollapsed, setNavbarCollapsed] = useState(false);

  //2개 title, no use만들고 value에 값,set
  const [projectNo, setProjectNo] = useState(0);
  const [projectTitle, setProjectTitle] = useState('');

  const [navbarStyle, setNavbarStyle] = useState(getItemFromStore('navbarStyle', settings.navbarStyle));

  const toggleModal = () => setIsOpenSidePanel(prevIsOpenSidePanel => !prevIsOpenSidePanel);
  const value = {
    isRTL,
    isDark,
    isCombo,
    isFluid,
    setIsRTL,
    isTopNav,
    currency,
    setIsDark,
    setIsCombo,
    setIsFluid,
    // isVertical,
    toggleModal,
    setIsTopNav,
    navbarStyle,
    setCurrency,
    // setIsVertical,
    showBurgerMenu,
    setNavbarStyle,
    isOpenSidePanel,
    navbarCollapsed,
    setShowBurgerMenu,
    setIsOpenSidePanel,
    setNavbarCollapsed,
    isNavbarVerticalCollapsed,
    setIsNavbarVerticalCollapsed,
    projectNo,
    setProjectNo,
    projectTitle,
    setProjectTitle
  };

  const setStylesheetMode = mode => {
    setIsLoaded(false);
    setItemToStore(mode, value[mode]);
    toggleStylesheet({ isRTL, isDark }, () => setIsLoaded(true));
  };

  useEffect(() => {
    setStylesheetMode('isFluid');
    // eslint-disable-next-line
  }, [isFluid]);

  useEffect(() => {
    setStylesheetMode('isRTL');
    // eslint-disable-next-line
  }, [isRTL]);

  useEffect(() => {
    setStylesheetMode('isDark');
    // eslint-disable-next-line
  }, [isDark]);

  useEffect(() => {
    setItemToStore('isNavbarVerticalCollapsed', isNavbarVerticalCollapsed);
    // eslint-disable-next-line
  }, [isNavbarVerticalCollapsed]);

  useEffect(() => {
    setItemToStore('isTopNav', isTopNav);
    // eslint-disable-next-line
  }, [isTopNav]);

  useEffect(() => {
    setItemToStore('isCombo', isCombo);
    // eslint-disable-next-line
  }, [isCombo]);
  // useEffect(() => {
  //   setItemToStore('isVertical', isVertical);
  //   // eslint-disable-next-line
  // }, [isVertical]);

  useEffect(() => {
    setItemToStore('navbarStyle', navbarStyle);
    // eslint-disable-next-line
  }, [navbarStyle]);

  if (!isLoaded) {
    toggleStylesheet({ isRTL, isDark }, () => setIsLoaded(true));

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: isDark ? themeColors.dark : themeColors.light
        }}
      />
    );
  }

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

Main.propTypes = { children: PropTypes.node };

export default Main;
