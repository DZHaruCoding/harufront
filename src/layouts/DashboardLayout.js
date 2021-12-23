import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import Dashboard from '../components/dashboard/Dashboard';
import DashboardAlt from '../components/dashboard-alt/DashboardAlt';
import NavbarTop from '../components/navbar/NavbarTop';
import NavbarVertical from '../components/navbar/NavbarVertical';
import Footer from '../components/footer/Footer';
import loadable from '@loadable/component';
import AppContext from '../context/Context';
import ProductProvider from '../components/e-commerce/ProductProvider';
import SidePanelModal from '../components/side-panel/SidePanelModal';
import { getPageName } from '../helpers/utils';
import Login from '../components/auth/LoginForm'
import Events from '../components/page/Events';
import { ProfileContext } from '../context/Context';

const DashboardRoutes = loadable(() => import('./DashboardRoutes'));

const DashboardLayout = ({ location }) => {
  const { isFluid, isVertical, navbarStyle } = useContext(AppContext);
  const { loading, notifications, setNotifications } = useContext(AppContext);
  const { isAllRead, setIsAllRead } = useContext(AppContext);
  const { ProfilePhoto, setProfilePhoto } = useContext(ProfileContext);
  const isKanban = getPageName('kanban');

  // 로그인 안된 인증안된 사용자일 경우 랜더링을 시키지 않고 로그인 화면으로 보내기 위한 상태
  const [enableRander, setEnableRander] = useState(false);

  useEffect(() => {
    DashboardRoutes.preload();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // 원래있던거 수정하다가 실수 했을수도 있어서 깃에 있는거 밑에 복사 해놨어요
  // useEffect(() => {
  //   const noticeFetch = async () => {
  //     try {
  //       const response = await fetch(
  //         `/haru/api/notice/getMyNotice`,
  //         {
  //           method: 'post',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Accept: 'application/json'
  //           },
  //           body: JSON.stringify(window.sessionStorage.getItem('authUserEmail'))
  //         },
  //         []
  //       );

  //       if (!response.ok) {
  //         throw new Error(`${response.status} ${response.statusText}`);
  //       }

  //       const jsonResult = await response.json();

  //       if (jsonResult.result != 'success') {
  //         throw new Error(`${jsonResult.result} ${jsonResult.message}`);
  //       }
  //       for (let i = 0; i < jsonResult.data.length; i++) {
  //         if (jsonResult.data[i].messageCk === 'N') {
  //           setIsAllRead(false);
  //           break;
  //         }
  //       }

  //       setNotifications(jsonResult.data);

  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   noticeFetch();
  // }, []);


  // 진석이형이 작업한거
  useEffect(() => {
    const noticeFetch = async () => {
      try {
        const response = await fetch(
          `/haru/api/notice/getMyNotice`,
          {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            redirect: "manual",
            referrer: "no-referrer",
            body: JSON.stringify(window.sessionStorage.getItem('authUserNo'))
          },
          []
        );

        console.log(" 넘어온 응답 " + response.ok);
        console.log(" 리다이렉트 url " + response.url);

        if (!response.ok) {
          window.location.href = response.url;
          console.log("여기로왔낭")
          throw new Error(`${response.status} ${response.statusText}`);
        }

        const jsonResult = await response.json();

        if (jsonResult.result != 'success') {
          throw new Error(`${jsonResult.result} ${jsonResult.message}`);
        }

        for (let i = 0; i < jsonResult.data.length; i++) {
          if (jsonResult.data[i].messageCk === 'N') {
            setIsAllRead(false);
            break;
          }
        }

        setNotifications(jsonResult.data);
      } catch (err) {
        console.log(err);
      }
    };
    setEnableRander(true)
    noticeFetch();
  }, []);

  return (
    <>
      {enableRander ?
        <div className={isFluid || isKanban ? 'container-fluid' : 'container'}>
          {isVertical && <NavbarVertical isKanban={isKanban} navbarStyle={navbarStyle} />}
          <ProductProvider>
            <div className="content">
              <NavbarTop />
              <Switch>
                <Route path="/pages/events" exact component={Events} />
                {/* <Route path="/dashboard-alt" exact component={DashboardAlt} /> */}
                <DashboardRoutes />
              </Switch>
              {!isKanban && <Footer />}
            </div>
            {/* <SidePanelModal path={location.pathname} /> */}
          </ProductProvider>
        </div>
        : null
      }
    </>
  );
};

DashboardLayout.propTypes = { location: PropTypes.object.isRequired };

export default DashboardLayout;
