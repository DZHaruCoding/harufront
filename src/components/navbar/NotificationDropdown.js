import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import ListGroup from 'reactstrap/es/ListGroup';
import ListGroupItem from 'reactstrap/es/ListGroupItem';
import { localIp } from '../../config';
import AppContext from '../../context/Context';
import { rawEarlierNotifications, rawNewNotifications } from '../../data/notification/notification';
import { isIterableArray } from '../../helpers/utils';
import useFakeFetch from '../../hooks/useFakeFetch';
import useFakeFetchV2 from '../../hooks/useFakeFetchV2';
import FalconCardHeader from '../common/FalconCardHeader';
import ProductProvider from '../e-commerce/ProductProvider';
import Notification from '../notification/Notification';
import NotificationBell from '../notification/NotificationBell';
import SockJsClient from 'react-stomp'

const NotificationDropdown = () => {
  // State
  // const { data: newNotifications, setData: setNewNotifications } = useFakeFetchV2([]);
  const { data: earlierNotifications, setData: setEarlierNotifications } = useFakeFetch([]);
  const [isOpen, setIsOpen] = useState(false);
  const {isAllRead, setIsAllRead} = useContext(AppContext);
  const { loading, notifications, setNotifications } = useContext(AppContext);
  const API_URL = "http://localhost:8080/haru";
  let clientRef = null;

  // useEffect(() => {
  //   const noticeFetch = async () => {

  //     try {
  //       const response = await fetch(`${localIp}/api/notice/getMyNotice`, {
  //         method: 'post',
  //         headers: {
  //           "Content-Type": 'application/json',
  //           'Accept': 'application/json'
  //         },
  //         body: JSON.stringify(1)
  //       }, []);
      
  //       if (!response.ok) {
  //         throw new Error(`${response.status} ${response.statusText}`);
  //       }
      
  //       const jsonResult = await response.json();
  //       console.log(jsonResult);
      
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
  //     } catch(err) {
  //       console.log(err);
  //     }
      
  //   }
  //   noticeFetch();
  // }, []);

  const socketCallback = (socketData) => {
    const now = new Date;
    const todayYear = now.getFullYear();
    const todayMonth = (now.getMonth() + 1) > 9 ? (now.getMonth() + 1) : '0' + (now.getMonth() + 1);
    const todayDate = now.getDate() > 9 ? now.getDate() : '0' + now.getDate();
    const day = todayYear + '-' + todayMonth + '-' + todayDate;

    const json = {
      noticeNo: socketData.bellNo,
      noticeMessage: socketData.bell,
      messageCk: 'N',
      noticeDate: day,
      noticLink: ''
    }
    setNotifications([json, ...notifications])
    setIsAllRead(false);
  }

  // Handler
  const handleToggle = async (e, k) => {
    e.preventDefault();

    try {
      //TODO 조진석 : 더미데이터 사용
    const json = {
      noticeNo : k,
      userNo : window.sessionStorage.getItem("authUserNo")
    }

    const response = await fetch(`/haru/api/notice/noticeCheck`, {
      method: 'post',
      headers: {
        "Content-Type": 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(json)
    }, []);
  
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  
    const jsonResult = await response.json();
  
    if (jsonResult.result != 'success') {
      throw new Error(`${jsonResult.result} ${jsonResult.message}`);
    }

    let arr = notifications;
    arr.map(notification => {
      if (notification.noticeNo === k) {
        notification.messageCk = 'Y'
        return notification;
      } else {
        return notification;
      }
    })

    setNotifications(arr);

    for (let i = 0; i < notifications.length; i++) {
      if (notifications[i].messageCk === 'N') {
        setIsAllRead(false);
        break;
      }
      
      if (i == notifications.length - 1) {
        setIsAllRead(true)
      }
    }

    } catch(err) {
      console.log(err);
    }
    setIsOpen(!isOpen);    
  };

  const markAsRead = async e => {
    e.preventDefault();

    try {
      //TODO 조진석 : 더미데이터 사용

    const response = await fetch(`/haru/api/notice/noticeAllCheck`, {
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
    console.log("확인",jsonResult);
  
    if (jsonResult.result != 'success') {
      throw new Error(`${jsonResult.result} ${jsonResult.message}`);
    }

    const updatedNewNotifications = notifications.map(notification => {
      if (notification.hasOwnProperty('messageCk')) {
        return {
          ...notification,
          messageCk: 'Y'
        };
      }
      return notification;
    });
  
    setIsAllRead(true);
    setNotifications(updatedNewNotifications);

  } catch(err) {
    console.log(err);
  }
    // setEarlierNotifications(updatedEarlierNotifications);
  };

  return (
    <Dropdown
      nav
      inNavbar
      isOpen={isOpen}
      toggle={handleToggle}
      onMouseOver={() => {
        let windowWidth = window.innerWidth;
        windowWidth > 992 && setIsOpen(true);
      }}
      onMouseLeave={() => {
        let windowWidth = window.innerWidth;
        windowWidth > 992 && setIsOpen(false);
      }}
    >
      <SockJsClient
          url={`${API_URL}/socket`}
          topics={[`/${window.sessionStorage.getItem("authUserNo")}`]}
          onMessage={socketData => {socketCallback(socketData)}}
          ref={(client) => {
            clientRef = client
          }}
      />
      <DropdownToggle
        nav
        className={classNames('px-0', {
          'notification-indicator notification-indicator-primary': !isAllRead
        })}
      >
        <FontAwesomeIcon icon="bell" transform="shrink-6" className="fs-4" />
      </DropdownToggle>
      <DropdownMenu right className="dropdown-menu-card">
        <Card className="card-notification shadow-none" style={{ maxWidth: '20rem' }}>
          <FalconCardHeader className="card-header" title="Notifications" titleTag="h6" light={false}>
            <Link className="card-link font-weight-normal" to="" onClick={markAsRead}>
              Mark all as read
            </Link>
          </FalconCardHeader>
          <ListGroup flush className="font-weight-normal fs--1">
            {/* <div className="list-group-title">NEW</div> */}
            {isIterableArray(notifications) &&
              notifications.map((notification, index) => (
                index < 5 ?
                <ListGroupItem key={notification.noticeNo} onClick={(e) => handleToggle(e, notification.noticeNo)}>
                  <NotificationBell {...notification} flush 
                      className={"rounded-0 border-x-0 border-300 border-bottom-0"} 
                      messageCk={notification.messageCk == 'N' ? true : false} />
                </ListGroupItem>
                : ''
              ))}
            {/* <div className="list-group-title">EARLIER</div>
            {isIterableArray(earlierNotifications) &&
              earlierNotifications.map((notification, index) => (
                <ListGroupItem key={index} onClick={handleToggle}>
                  <Notification {...notification} flush />
                </ListGroupItem>
              ))} */}
          </ListGroup>
          <div className="card-footer text-center border-top" onClick={handleToggle}>
            <Link className="card-link d-block" to="/pages/notifications">
              View all
            </Link>
          </div>
        </Card>
      </DropdownMenu>
    </Dropdown>
  );
};

export default NotificationDropdown;
