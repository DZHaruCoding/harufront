import React, { useEffect, useRef, useState,useContext } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Row, UncontrolledTooltip } from 'reactstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DropdownFilter from '../email/inbox/DropdownFilter';
import CalendarEventModal from './CalendarEventModal';
import AddScheduleModal from './AddScheduleModal';
import Flex from '../common/Flex';

import events from '../../data/calendar/events';
import { localIp } from '../../config';
import { set } from 'lodash';
import AppContext from '../../context/Context';
const Calendar = () => {
  const calendarRef = useRef();
  const [calendarApi, setCalendarApi] = useState({});
  const [title, setTitle] = useState('');
  const [currentFilter, setCurrentFilter] = useState('Month View');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [updateisOpenModal, setUpdateisOpenModal] = useState(false);
  const [isOpenScheduleModal, setIsOpenScheduleModal] = useState(false);
  const [modalEventContent, setModalEventContent] = useState(false);
  const [addScheduleStartDate, setAddScheduleStartDate] = useState();
  const [palra,setPalra] = useState(false);
  const [detailData, setDetailData] = useState();
  const {projectNo} = useContext(AppContext);
  const {projectTitle} = useContext(AppContext);
console.log('!!!!!!!!!!!!+',projectNo);

  const buttonText = {
    today: 'Today',
    month: 'Month view',
    week: 'week',
    day: 'day',
    listWeek: 'list view',
    listYear: 'year'
  };

  const eventTimeFormat = {
    hour: 'numeric',
    minute: '2-digit',
    omitZeroMinute: true,
    meridiem: true
  };

  const viewName = ['Month View', 'Week View', 'Day View', 'List View', 'Year View'];

  const views = {
    week: {
      eventLimit: 3
    }
  };

  const eventList = events.reduce(
    (acc, event) => (event.schedules ? acc.concat(event.schedules.concat(event)) : acc.concat(event)),
    []
  );

  const [initialEvents, setInitialEvents] = useState();

  useEffect(() => {
    setCalendarApi(calendarRef.current.getApi());
  }, []);

  useEffect( () => {
   const fetchfun = async () => {
    try {
      const response = await fetch(`${localIp}/api/calendar/1`,{
        method: 'get',
        headers:{
          'Content-Type':'application/json',
          'Accept':'application/json'
        },
        body:null
      });

      //fetch 성공하면
      if(!response.ok){
        throw new Error(`${response.status} ${response.statusText}`);
      }
      //결과를 json으로 변환하기
      const jsonResult = await response.json();
      console.log(jsonResult.data);

      //통신 했지만 결과값이 success가 아니면
      if(jsonResult.result !== 'success'){
        throw new Error(`${jsonResult.result} ${jsonResult.message}`);
      } 

      //setInitialEvents에 데이터 셋팅하기
      setInitialEvents(jsonResult.data);
      console.log('init',initialEvents);
      let test = [];
      jsonResult.data.scheduleList.map(schedule => test = [...test,{ 
                                id: schedule.scheduleNo,
                                title: schedule.scheduleContents,
                                start: schedule.scheduleStart,
                                end: schedule.scheduleEnd
                                }]);
      jsonResult.data.taskList.map(task => test = [...test,{
                                id: task.taskNo,
                                title: task.taskContents,
                                start: task.taskStart,
                                end: task.taskEnd
                                }]);
      console.log(test);
      setInitialEvents(test);
    } catch (error) {
      console.log(error);
    }
  };
  fetchfun();
  }, []);

  const handleFilter = filter => {
    setCurrentFilter(filter);
    switch (filter) {
      case 'Month View':
        calendarApi.changeView('dayGridMonth');
        setTitle(calendarApi.getCurrentData().viewTitle);
        break;
      case 'Week View':
        calendarApi.changeView('timeGridWeek');
        setTitle(calendarApi.getCurrentData().viewTitle);
        break;
      case 'Day View':
        calendarApi.changeView('timeGridDay');
        setTitle(calendarApi.getCurrentData().viewTitle);
        break;
      case 'List View':
        calendarApi.changeView('listWeek');
        setTitle(calendarApi.getCurrentData().viewTitle);
        break;
      default:
        calendarApi.changeView('listYear');
        setTitle(calendarApi.getCurrentData().viewTitle);
    }
  };

  const handleEventClick = info => {
    if (info.event.url) {
      window.open(info.event.url);
      info.jsEvent.preventDefault();
    } else {
      setModalEventContent(info);
      console.log('info가 뭐야',info.event._def);
      console.log('initialEvents',initialEvents);
      setDetailData(info.event._def);
      setIsOpenModal(true);
    }
  };
  const [updata,setUpdata] = useState();
  const updateData = (data) =>{
    console.log('캘린더 업데이트 데이터',data);

    if (data) {
      const fetchfun = async () => {
        try {
          const response = await fetch(`${localIp}/api/calendar/1`,{
            method: 'get',
            headers:{
              'Content-Type':'application/json',
              'Accept':'application/json'
            },
            body:null
          });
    
          //fetch 성공하면
          if(!response.ok){
            throw new Error(`${response.status} ${response.statusText}`);
          }
          //결과를 json으로 변환하기
          const jsonResult = await response.json();
          console.log(jsonResult.data);
    
          //통신 했지만 결과값이 success가 아니면
          if(jsonResult.result !== 'success'){
            throw new Error(`${jsonResult.result} ${jsonResult.message}`);
          } 
    
          //setInitialEvents에 데이터 셋팅하기
          setInitialEvents(jsonResult.data);
          console.log('init',initialEvents);
          let test = [];
          jsonResult.data.scheduleList.map(schedule => test = [...test,{ 
                                    id: schedule.scheduleNo,
                                    title: schedule.scheduleContents,
                                    start: schedule.scheduleStart,
                                    end: schedule.scheduleEnd
                                    }]);
          jsonResult.data.taskList.map(task => test = [...test,{
                                    id: task.taskNo,
                                    title: task.taskContents,
                                    start: task.taskStart,
                                    end: task.taskEnd
                                    }]);
          console.log(test);
          setInitialEvents([...initialEvents],test);
        } catch (error) {
          console.log(error);
        }
      };
      fetchfun();

      // setInitialEvents([...initialEvents,json]);
    }
      
    

    
  }
  return (
    <>
    
      <Card className="mb-3">
        <CardHeader>
          <Row noGutters className="align-items-center">
            <Col xs="auto" className="d-flex justify-content-end order-md-1">
              <UncontrolledTooltip placement="bottom" target="previous">
                Previous
              </UncontrolledTooltip>
              <UncontrolledTooltip placement="bottom" target="next">
                Next
              </UncontrolledTooltip>
              <Button
                onClick={() => {
                  calendarApi.prev();
                  setTitle(calendarApi.getCurrentData().viewTitle);
                }}
                color="link"
                className="icon-item icon-item-sm icon-item-hover shadow-none p-0 mr-1 ml-md-2"
                id="previous"
              >
                <FontAwesomeIcon icon="arrow-left" />
              </Button>
              <Button
                onClick={() => {
                  calendarApi.next();
                  setTitle(calendarApi.getCurrentData().viewTitle);
                }}
                color="link"
                className="icon-item icon-item-sm icon-item-hover shadow-none p-0 mr-1"
                id="next"
              >
                <FontAwesomeIcon icon="arrow-right" />
              </Button>
            </Col>
            <Col xs="auto" md="auto" className="order-md-2">
              <h4 className="mb-0 fs-0 fs-sm-1 fs-lg-2 calendar-title">
                {title || `${calendarApi.currentDataManager?.data?.viewTitle}`}
              </h4>
            </Col>
            <Col xs md="auto" tag={Flex} justify="end" className="order-md-3">
              <Button
                size="sm"
                color="falcon-primary"
                onClick={() => {
                  calendarApi.today();
                  setTitle(calendarApi.getCurrentData().viewTitle);
                }}
              >
                Today
              </Button>
            </Col>
            <Col md="auto" className="d-md-none">
              <hr />
            </Col>
            <Col xs="auto" className="d-flex order-md-0">
              <Button color="primary" size="sm" onClick={() => setIsOpenScheduleModal(true)}>
                <FontAwesomeIcon icon="plus" className="mr-1" /> Add Schedule
              </Button>
            </Col>
            <Col className="d-flex justify-content-end order-md-2">
              <DropdownFilter
                className="mr-2"
                filters={viewName}
                currentFilter={currentFilter}
                handleFilter={handleFilter}
                icon="sort"
                right
              />
            </Col>
          </Row>
        </CardHeader>
        <CardBody className="p-0">
          
          <FullCalendar
            ref={calendarRef}
            headerToolbar={false}
            plugins={[dayGridPlugin, bootstrapPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="dayGridMonth"
            themeSystem="bootstrap"
            dayMaxEvents={2}
            height={800}
            stickyHeaderDates={false}
            editable
            selectable
            selectMirror
            select={info => {
              setIsOpenScheduleModal(true);
              setAddScheduleStartDate(info.start);
            }}
            views={views}
            eventTimeFormat={eventTimeFormat}
            eventClick={handleEventClick}
            events={initialEvents}
            buttonText={buttonText}
          />
        </CardBody>
      </Card>
{
  isOpenScheduleModal === true ?
  <AddScheduleModal
        isOpenScheduleModal={isOpenScheduleModal}
        setIsOpenScheduleModal={setIsOpenScheduleModal}
        initialEvents={initialEvents}
        setInitialEvents={setInitialEvents}
        addScheduleStartDate={addScheduleStartDate}
        setAddScheduleStartDate={setAddScheduleStartDate}
        palra={false}
      />
      :
      null
}
      
    { 

      isOpenModal === true ?
      <CalendarEventModal
      isOpenModal={isOpenModal}
      updateisOpenModal={updateisOpenModal}
      setIsOpenModal={setIsOpenModal}
      setInitialEvents={setInitialEvents}
      modalEventContent={modalEventContent}
      setModalEventContent = {setModalEventContent}
      detailData = {detailData}
      updatecallback = {updateData}
      />
      :
      null
    }

    </>
    
  );

};

export default Calendar;