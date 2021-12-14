import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  CustomInput,
  Form,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from 'reactstrap';
import Notification from '../notification/Notification';
import NotificationBell from '../notification/NotificationBell';
import FalconCardHeader from '../common/FalconCardHeader';
import Loader from '../common/Loader';
import { isIterableArray } from '../../helpers/utils';
import { notifications as rawNotifications } from '../../data/notification/notification';
import useFakeFetch from '../../hooks/useFakeFetch';
import { localIp } from '../../config';
import useFakeFetchV2 from '../../hooks/useFakeFetchV2';
import ProductProvider from '../e-commerce/ProductProvider';
import AppContext from '../../context/Context';

const NotificationSettings = () => {
  const [check1, setCheck1] = useState(true);
  const [check2, setCheck2] = useState(true);
  const [check3, setCheck3] = useState(true);

  const listGroupItemClasses = 'd-flex justify-content-between align-items-center py-2 px-0 border-200';

  return (
    <Form>
      <CustomInput
        type="radio"
        id="exampleCustomRadio"
        name="customRadio"
        label="Get a notification each time there is activity on your page or an important update."
      />
      <CustomInput
        type="radio"
        id="exampleCustomRadio2"
        name="customRadio"
        label="Get one notification every 12-24 hours on all activity and updates."
      />
      <CustomInput type="radio" id="exampleCustomRadio3" name="customRadio" label="Off" />

      <h5 className="fs-0 mb-3 mt-4">Edit your notification settings for: </h5>

      <ListGroup flush className="mb-4 fs--1">
        <ListGroupItem className={listGroupItemClasses}>
          <span>New Mention of Page </span>
          <span>
            <Label check />
            <Input type="checkbox" checked={check1} onChange={() => setCheck1(!check1)} />
          </span>
        </ListGroupItem>
        <ListGroupItem className={listGroupItemClasses}>
          <span>New Comments on page post</span>
          <span>
            <Label check />
            <Input type="checkbox" checked={check2} onChange={() => setCheck2(!check2)} />
          </span>
        </ListGroupItem>
        <ListGroupItem className={listGroupItemClasses}>
          <span>Edits to Comments you have written</span>
          <span>
            <Label check />
            <Input type="checkbox" checked={check3} onChange={() => setCheck3(!check3)} />
          </span>
        </ListGroupItem>
      </ListGroup>

      <CustomInput
        type="checkbox"
        id="customCheckboxActivity"
        label="Allow notifications from your followers activity"
      />
      <CustomInput type="checkbox" id="customCheckboxAssociationsGroups" label="Groups" />
      <CustomInput type="checkbox" id="customCheckboxAssociations" label="Associations" />
    </Form>
  );
};

const Notifications = ({ items = rawNotifications.length, children }) => {
  // const { loading, data: notifications, setData: setNotifications } = useFakeFetchV2([]);
  const [settingsIsOpen, setSettingsIsOpen] = useState(false);
  const {isAllRead, setIsAllRead} = useContext(AppContext);
  const { loading, notifications, setNotifications } = useContext(AppContext);

  const toggleSettingsModal = () => setSettingsIsOpen(!settingsIsOpen);

  
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

  // Handler
  const handleToggle = async (e, k) => {
    e.preventDefault();

    try {
    const json = {
      noticeNo : k,
      userNo : '1'
    }

    console.log(k);

    const response = await fetch(`${localIp}/api/notice/noticeCheck`, {
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

  }

  const markAsRead = async e => {
    e.preventDefault();

    try {
      //TODO 조진석 : 더미데이터 사용

    const response = await fetch(`${localIp}/api/notice/noticeAllCheck`, {
      method: 'post',
      headers: {
        "Content-Type": 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(1)
    }, []);
  
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  
    const jsonResult = await response.json();
    console.log("확인",jsonResult);
  
    if (jsonResult.result != 'success') {
      throw new Error(`${jsonResult.result} ${jsonResult.message}`);
    }

    const updatedNotifications = notifications.map(notification => {
      if (notification.hasOwnProperty('messageCk')) {
        return {
          ...notification,
          messageCk: 'Y'
        };
      }
      return notification;
    });

    setIsAllRead(true);
    setNotifications(updatedNotifications);

  } catch(err) {
    console.log(err);
  }
  };

  return (
    <Card className="h-100">
      <FalconCardHeader title="Your Notifications">
        <div className="fs--1">
          <Link className="text-sans-serif" to="#!" onClick={markAsRead}>
            Mark all as read
          </Link>
          {/* <Link className="text-sans-serif ml-2 ml-sm-3" to="#!" onClick={toggleSettingsModal}>
            Notification settings
          </Link> */}
        </div>

        {/* <Modal isOpen={settingsIsOpen} toggle={toggleSettingsModal} centered size="lg">
          <ModalHeader>Notification Settings</ModalHeader>
          <ModalBody>
            <NotificationSettings />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" size="sm" onClick={toggleSettingsModal}>
              Cancel
            </Button>
            <Button color="primary" size="sm" onClick={toggleSettingsModal}>
              Update
            </Button>
          </ModalFooter>
        </Modal> */}
      </FalconCardHeader>
      <CardBody className="p-0">
        {loading ? (
          <Loader />
        ) : isIterableArray(notifications) ? (
          notifications.map((notification, index) => 
          <ListGroupItem key={notification.noticeNo} onClick={(e) => handleToggle(e, notification.noticeNo)}>
          <NotificationBell {...notification} key={notification.noticeNo} 
          messageCk={notification.messageCk == 'N' ? true : false}/>
          </ListGroupItem>)
        ) : (
          <Row className="p-card">
            <Col>
              <Alert color="info" className="mb-0">
                No notifications found!
              </Alert>
            </Col>
          </Row>
        )}
      </CardBody>
      {children}
    </Card>
  );
};

Notifications.propTypes = {
  items: PropTypes.number,
  children: PropTypes.node
};

export default Notifications;
