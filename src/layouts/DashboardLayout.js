import React, { useContext, useEffect } from 'react';
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

import Events from '../components/page/Events';

const DashboardRoutes = loadable(() => import('./DashboardRoutes'));

const DashboardLayout = ({ location }) => {
  const { isFluid, isVertical, navbarStyle } = useContext(AppContext);
  const { loading, notifications, setNotifications } = useContext(AppContext);
  const {isAllRead, setIsAllRead} = useContext(AppContext);

  const isKanban = getPageName('kanban');

  useEffect(() => {
    DashboardRoutes.preload();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const noticeFetch = async () => {

      try {
        const response = await fetch(`/haru/api/notice/getMyNotice`, {
          method: 'post',
          headers: {
            "Content-Type": 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(window.sessionStorage.getItem("authUserNo"))
        }, []);
      
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
      
        const jsonResult = await response.json();
        console.log(jsonResult);
      
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
      } catch(err) {
        console.log(err);
      }
      
    }
    noticeFetch();
  }, []);

  return (
    <div className={isFluid || isKanban ? 'container-fluid' : 'container'}>
      {isVertical && <NavbarVertical isKanban={isKanban} navbarStyle={navbarStyle} />}
      <ProductProvider>
        <div className="content">
          <NavbarTop />
          <Switch>
            <Route path="/" exact component={Events} />
            {/* <Route path="/dashboard-alt" exact component={DashboardAlt} /> */}
            <DashboardRoutes />
          </Switch>
          {!isKanban && <Footer />}
        </div>
        {/* <SidePanelModal path={location.pathname} /> */}
      </ProductProvider>
    </div>
  );
};

DashboardLayout.propTypes = { location: PropTypes.object.isRequired };

export default DashboardLayout;
