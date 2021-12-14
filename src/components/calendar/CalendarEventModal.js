import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Input, Media, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Flex from '../common/Flex';
import moment from 'moment';
import UpdateScheduleModal from './UpdateScheduleModal';
import { update } from 'lodash';


const getCircleStackIcon = (icon, transform) => (
  <span className="fa-stack ml-n1 mr-3">
    <FontAwesomeIcon icon="circle" className="text-200 fa-stack-2x" />
    <FontAwesomeIcon icon={icon} transform={transform ?? ''} className="text-primary fa-stack-1x" inverse />
  </span>
);

const EventModalMediaContent = ({ icon, heading, content, children }) => (
  <Media className="mt-3">
    {getCircleStackIcon(icon)}
    <Media body>
      <>
        <h6>{heading}</h6>
        {children || <p className="mb-0 text-justify">{content}</p>}
      </>
    </Media>
  </Media>
);


const CalendarEventModal = ({ isOpenModal, setIsOpenModal, modalEventContent}) => {
  const toggle = () => setIsOpenModal(!isOpenModal);
  const { id,title, end, start } = isOpenModal && modalEventContent.event;
  const { description, location, organizer, schedules } = isOpenModal && modalEventContent.event.extendedProps;
  //false 모달 상태값 생성
  const [isOpenScheduleModal, setIsOpenScheduleModal] = useState(false);
  const [addScheduleStartDate, setAddScheduleStartDate] = useState();
  const [initialEvents, setInitialEvents] = useState(null);
  const closeBtn = (
    <button className="close font-weight-normal" onClick={toggle}>
      &times;
    </button>
  );

  const modifyCallbackFun = (date) => {
    console.log("테이더 확인",date)
    // setModalContent(date);
  }

  return (

    <Modal isOpen={isOpenModal} toggle={toggle} modalClassName="theme-modal" contentClassName="border" centered>
      {/* title (제목) */}
      <ModalHeader toggle={toggle} tag="div" className="px-card bg-light border-0 flex-between-center" close={closeBtn}>
        <h5 className="mb-0">{title}</h5>
        {organizer && (
          <p className="mb-0 fs--1 mt-1">
            by <a href="#!">{organizer}</a>
          </p>
        )}
      </ModalHeader>
      
      {/* 모달창 body */}
      <ModalBody className="px-card pb-card pt-1 fs--1">
        {description && <EventModalMediaContent icon="align-left" heading="Description" content={description} />}
        {(end || start) && (
          <EventModalMediaContent icon="calendar-check" heading="Date and Time">
            <span>시작일 : {moment(start).format('YYYY-MM-DD HH:mm:ss')}</span>
            {end && (
              <>
                {' '}
                 <br /> <span>마감일 : {moment(end).format('YYYY-MM-DD HH:mm:ss')}</span>
              </>
            )}
          </EventModalMediaContent>
        )}
        {/* {location && (
          <EventModalMediaContent icon="map-marker-alt" heading="Location">
            <div className="mb-1" dangerouslySetInnerHTML={{ __html: location }} />
          </EventModalMediaContent>
        )}
        {schedules && (
          <EventModalMediaContent icon="clock" heading="Schedule">
            <ul className="list-unstyled timeline mb-0">
              {schedules.map((schedule, index) => (
                <li key={index}>{schedule.title}</li>
              ))}
            </ul>
          </EventModalMediaContent>
        )} */}
      </ModalBody>

      <UpdateScheduleModal
              isOpenScheduleModal={isOpenScheduleModal}
              setIsOpenScheduleModal={setIsOpenScheduleModal}
              initialEvents={initialEvents}
              setInitialEvents={setInitialEvents}
              addScheduleStartDate={addScheduleStartDate}
              setAddScheduleStartDate={setAddScheduleStartDate}
              callback={modifyCallbackFun}
              no ={id}
              title = {title}
              start = {start}
              end = {end}/>

      <ModalFooter tag={Flex} justify="end" className="bg-light px-card border-top-0">
        {/* 수정버튼 */}
        <Button  color="falcon-default" size="sm"
          //수정 버튼 클릭시 수정 상태 true로 변환
          onClick={ () =>
            setIsOpenScheduleModal(true)

           }>

          <FontAwesomeIcon icon="pencil-alt" className="fs--2 mr-2"/>
          <span>{id}수정</span>
        </Button>
 
        {/* 삭제버튼 (수정 해야함)*/}
        <Button  color="falcon-primary" size="sm">
          <span>삭제</span>
        </Button>
      </ModalFooter>
    </Modal>
  );
  
};

export default CalendarEventModal;
