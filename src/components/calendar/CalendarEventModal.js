import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Input, Media, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Flex from '../common/Flex';
import moment from 'moment';
import UpdateScheduleModal from './UpdateScheduleModal';
import { update } from 'lodash';
import { localIp } from '../../config';

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


const CalendarEventModal = ({ isOpenModal, setIsOpenModal,scheduledetailData, modalEventContent,setModalEventContent,updatecallback,deletecallback}) => {
  const toggle = () => setIsOpenModal(!isOpenModal);
  const { id,title, end, start } = isOpenModal && scheduledetailData;

  // const { description, location, organizer, schedules } = isOpenModal && modalEventContent.event.extendedProps;
  //false 모달 상태값 생성
  const [isOpenScheduleModal, setIsOpenScheduleModal] = useState(false);
  const [addScheduleStartDate, setAddScheduleStartDate] = useState();
  const [initialEvents, setInitialEvents] = useState(null);
    // const eventData = isOpenModal && modalEventContent.event;
  // console.log('event 데이터 :',eventData);
  // console.log('event.title 데이터 :',eventData.title); //쇼핑하기
  // let b = {id: eventData.id,
  //         title: eventData.title,
  //         start: eventData.start,
  //         end: eventData.end};
  // const [eData,setEDate] = useState('');
  // setEDate(b);
  // console.log('b : ',eData);

  // const [testTitle, setTestTitle] = useState([eventData.title]);
  // console.log('상태값 title:',testTitle);
  // console.log('detailDatas.title는?',detailData);
  // const [detailDatas,setDetailDatas] = useState(detailData);
  // console.log('detailDatas는?',detailDatas);
  // console.log('detailData.no:',id);
  const [detailData,setDetailData] = useState();

  useEffect(() => {
    const scheduleDetail = async() => {  
      console.log('스케쥴 상세보기',scheduledetailData[0].id)
      try {
         const response = await fetch('/haru/api/calendar/detail/'+scheduledetailData[0].id,{
             method: "get",
             headers:{
                 'Content-Type':'application/json',
                 'Accept':'application/json'
             },
             body: null
         });
         console.log('+');
         console.log('상세보기 response 데이터',response);
         //response ok 가 아니면(실패)
         if(!response.ok){
             throw new Error(`${response.status} ${response.statusText}`);
         }
         //response 데이터 json으로 변환하기
         const jsonResult = await response.json(); //여기서부터 오류 null값..
        
         console.log('개인일정 상세보기 정보 json:',jsonResult.data);

               //통신 했지만 결과값이 success가 아니면
         if(jsonResult.result !== 'success'){
         throw new Error(`${jsonResult.result} ${jsonResult.message}`);
         }
         let data ={
          id:jsonResult.data.scheduleNo,
          title: jsonResult.data.scheduleContents,
          start: jsonResult.data.scheduleStart,
          end: jsonResult.data.scheduleEnd
        };
         setDetailData(data);

   } catch (error) {
      console.log(error); 
   }
  }; 
  scheduleDetail();
}, []);

const call = () => {
  console.log("call back",detailData)
  updatecallback(detailData);
  setIsOpenModal(false);
}

  const closeBtn = (
    <button className="close font-weight-normal" onClick={toggle}>
      &times;
    </button>
  );
  // 개인 일정
  const modifyCallbackFun = (date) => {
    console.log("테이더 확인", date)
    setDetailData(date);
  }
  
  // 개인 일정 삭제
    
    const scheduleDelete = async () => {
      console.log('hhh');
      try {
        console.log(id);
       
        const response = await fetch('/haru/api/calendar/delete/'+scheduledetailData[0].id, {
          method:"delete",
          headers:{
            'Content-Type':'application/json',
            'Accept':'application/json'
            },
            body: null
        })
        
        console.log('삭제 성공 여부 : ',response);
         //response ok 가 아니면(실패)
         if(!response.ok){
          throw new Error(`${response.status} ${response.statusText}`);
          }
          deletecallback(true);
          setIsOpenModal(false);        
     } catch (error) {
       console.log(error);
     } 
    }

  return (

    <Modal isOpen={isOpenModal} toggle={toggle} modalClassName="theme-modal" contentClassName="border" centered>
      {/* title (제목) */}
      <ModalHeader toggle={toggle} tag="div" className="px-card bg-light border-0 flex-between-center" close={closeBtn}>
        <h5 className="mb-0">{detailData && detailData.title}</h5>
        {/* {organizer && (
          <p className="mb-0 fs--1 mt-1">
            by <a href="#!">{organizer}</a>
          </p>
        )} */}
      </ModalHeader>

      {/* 모달창 body */}
      <ModalBody className="px-card pb-card pt-1 fs--1">
        {/* {description && <EventModalMediaContent icon="align-left" heading="Description" content={description} />} */}
        {(detailData && detailData.end || detailData && detailData.start) && (
          <EventModalMediaContent icon="calendar-check" heading="Date and Time">
            <span>시작일 : {moment(detailData && detailData.start).format('YYYY-MM-DD HH:mm:ss')}</span>
            {detailData && detailData.end && (
              <>
                {' '}
                 <br /> <span>마감일 : {moment(detailData && detailData.end).format('YYYY-MM-DD HH:mm:ss')}</span>
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
              isOpenModal={false}
              setIsOpenScheduleModal={setIsOpenScheduleModal}
              // initialEvents={initialEvents}
              // setInitialEvents={setInitialEvents}
              addScheduleStartDate={addScheduleStartDate}
              setAddScheduleStartDate={setAddScheduleStartDate}
              callback={modifyCallbackFun}
              // eventData={eventData}
              no ={scheduledetailData[0].id}
              title = {scheduledetailData[0].title}
              start = {scheduledetailData[0].start}
              end = {scheduledetailData[0].end}
              updatedata={detailData}
              />

      <ModalFooter tag={Flex} justify="end" className="bg-light px-card border-top-0">
        {/* 수정버튼 */}
        <Button  color="falcon-default" size="sm"
          //수정 버튼 클릭시 수정 상태 true로 변환
          onClick={ () =>
            setIsOpenScheduleModal(true)

           }>

          <FontAwesomeIcon icon="pencil-alt" className="fs--2 mr-2"/>
          <span>수정</span>
        </Button>
 
        {/* 삭제버튼 (수정 해야함)*/}
        <Button  color="falcon-primary" size="sm" onClick={ () =>  { scheduleDelete()}}>
          <span>삭제</span>
        </Button>
        <Button  color="falcon-primary" size="sm" onClick={ () => {call()} }>
          <span>확인</span>
        </Button>
      </ModalFooter>
    </Modal>
  );
  
};

export default CalendarEventModal;
