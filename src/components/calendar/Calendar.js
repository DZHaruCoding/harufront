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
import AppContext from '../../context/Context';
import { Link } from 'react-router-dom';
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
  const [addScheduleEndDate, setAddScheduleEndDate] = useState();
  const [palra,setPalra] = useState(false);
  const [detailData, setDetailData] = useState();
  const {projectNo} = useContext(AppContext);
  const {projectTitle} = useContext(AppContext);
  // const {members} = useContext(AppContext);

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
  const [changeChk,setChangeChk] = useState(false);
  useEffect(() => {
    setCalendarApi(calendarRef.current.getApi());
  }, []);

  //?????? ???
  const [calendarList,setCalendarList] = useState();
  
  
  useEffect( () => {
    // console.log('%%%%%%',members);
    const fetchfun = async () => {
      try {
        window.sessionStorage.getItem("authUserNo")
        console.log('authUserNo',window.sessionStorage.getItem("authUserNo"));
        const response = await fetch('/haru/api/calendar/'+window.sessionStorage.getItem("authUserNo"),{
          method: 'get',
          headers:{
            'Content-Type':'application/json',
            'Accept':'application/json'
          },
          body:null
        });

        //fetch ????????????
        if(!response.ok){
          throw new Error(`${response.status} ${response.statusText}`);
        }
        //????????? json?????? ????????????
        const jsonResult = await response.json();
        console.log(jsonResult.data);

        //?????? ????????? ???????????? success??? ?????????
        if(jsonResult.result !== 'success'){
          throw new Error(`${jsonResult.result} ${jsonResult.message}`);
        } 

        //setInitialEvents??? ????????? ????????????
        // setInitialEvents('json ????????? : ',jsonResult.data);
        // let scheduledata = [];
        // jsonResult.data.scheduleList.map(schedule => scheduledata = [...scheduledata,{ 
        //                           id: schedule.scheduleNo,
        //                           title: schedule.scheduleContents,
        //                           start: schedule.scheduleStart,
        //                           end: schedule.scheduleEnd
        //                           }]);
        // // setCalendarList(scheduledata);
        // let taskdata = [];
        // jsonResult.data.taskList.map(task => taskdata = [...taskdata,{
        //                           id: task.taskNo,
        //                           title: task.taskContents,
        //                           start: task.taskStart,
        //                           end: task.taskEnd,
        //                           color:task.taskLabel,
        //                           textColor:"white"
        //                           }]);
        // console.log('????????? ????????? / ????????? : ',scheduledata);
        // console.log('????????? ????????? / ?????? : ',taskdata);

        // const tst = [...scheduledata, ...taskdata]
        // console.log(tst);
        // // let data =[scheduledata.data,taskdata.data];
        // // console.lod(scheduledata.data);
        // setCalendarList(tst);

        // // 

        let test = [];
        jsonResult.data.scheduleList.map(schedule => test = [...test,{ 
                                  id: schedule.scheduleNo,
                                  title: schedule.scheduleContents,
                                  start: schedule.scheduleStart,
                                  end: schedule.scheduleEnd
                                  }]);
        jsonResult.data.taskList.map(task => test = [...test,{
                                  id: task.taskNo,
                                  title: task.projectTitle+" | "+task.taskContents,
                                  start: task.taskStart,
                                  end: task.taskEnd,
                                  color:task.taskLabel,
                                  textColor:"white",
                                  // url:"http://localhost:3000/pages/kanban"
                                  }]);
                                  
        console.log('????????? ?????????',test);
        setCalendarList(test);

        setChangeChk(false);
      } catch (error) {
        console.log(error);
      }
    };

    
    fetchfun();
  }, [changeChk]);

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
    //????????? ??????
    if (info.event._def.ui.borderColor == "") { 
      console.log('?????? ?????? ??????',info.event.id);
      const no = info.event.id;
      console.log(no)
      const fetchfun = async() => {
        const response = await fetch('/haru/api/calendar/detail/'+no,{
          method:"get",
          headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: null
        });

        if(!response.ok){
          throw new Error(`${response.status} ${response.statusText}`);
        }
        const jsonResult = await response.json(); //??????????????? ?????? null???..
       
        console.log('????????? ????????? ?????? json data :',jsonResult.data);
        console.log('????????? ????????? ?????? json data :',jsonResult.data.scheduleNo);
  
              //?????? ????????? ???????????? success??? ?????????
        if(jsonResult.result !== 'success'){
        throw new Error(`${jsonResult.result} ${jsonResult.message}`);
        }
        
        let data = [{
          id : jsonResult.data.scheduleNo,
          title : jsonResult.data.scheduleContents,
          start : jsonResult.data.scheduleStart,
          end : jsonResult.data.scheduleEnd
        }]
        setDetailData(data);
        setIsOpenModal(true);


      }
      fetchfun()
    } else { // ?????? ??????
      // console.log('color ??????????',)
      // setModalEventContent(info);
      // console.log('info color',info.event._def.ui.borderColor);
      // console.log('info??? ??????',info.event._def);
      // console.log('?????? ?????? ???')
      // const no = info.event.id;
      // console.log(no)
      
      // const fetchfun = async () =>{
      //   const response = await fetch('/haru/api/calendar/task/'+no,{
      //     method: 'get',
      //     headers:{
      //       'Content-Type': 'application/json',
      //       'Accept': 'application/json'
      //     },
      //     body: null
      //   });

      //   if(!response.ok){
      //     throw new Error(`${response.status} ${response.statusText}`);
      // }
      // const jsonResult = await response.json(); //??????????????? ?????? null???..
       
      // console.log('?????? ?????? ??? json data :',jsonResult.data);
      // if(jsonResult.result !== 'success'){
      //   throw new Error(`${jsonResult.result} ${jsonResult.message}`);
      //   }

      // } 
      // fetchfun()
      // setDetailData(info.event._def);
      // setIsOpenModal(true);
    }
  };
  const [updata,setUpdata] = useState();

  const deletecallback = (deletesuccess) =>{
    if(deletesuccess == true){
      setChangeChk(true);  
    }else{
      setChangeChk(false);
    }

  }

  const addcallback = (addsuccess) =>{
    if(addsuccess == true){
      setChangeChk(true);
    }else{
      setChangeChk(false);
    }
  }

  const updateData = (data) =>{
    console.log('????????? ???????????? ?????????',data);

    if (data) {
 
      setChangeChk(true);
    }
  }

    const draganddrop = (e) =>{
    //?????? format
    var today = new Date(e.event.start);
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);
    var dateString = year + '-' + month  + '-' + day;
    
    if(e.event.end == null){
      var dateStringend = dateString;
    } else {
      var today = new Date(e.event.end);
      var year = today.getFullYear();
      var month = ('0' + (today.getMonth() + 1)).slice(-2);
      var day = ('0' + today.getDate()).slice(-2);
      var dateStringend = year + '-' + month  + '-' + day;
    }  
    const scheduleNo = e.event.id;
    const scheduleTitle = e.event.title;
  
    let data = {
      scheduleNo:scheduleNo,
      scheduleContents:scheduleTitle,
      scheduleStart:dateString,
      scheduleEnd:dateStringend
    }
  
    const fetchfun = async () =>{
      console.log('data',data);
      const response = await fetch('/haru/api/calendar/schedule/update',{
        method:"put",
        headers:{
          'Content-Type':'application/json',
          'Accept':'application/json'
        },
        body:JSON.stringify(data)
      });

      if(!response.ok){
        throw new Error(`${response.status} ${response.statusText}`);
      }
  
      const jsonResult = await response.json();
      console.log('update',jsonResult);

      setChangeChk(true);
    }
    fetchfun()
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
            selectable={true}
            editable={true}
            selectMirror={true}
            select={info => {
              setIsOpenScheduleModal(true);
              setAddScheduleStartDate(info.start);
              setAddScheduleEndDate(info.end);
            }}
            views={views}
            eventTimeFormat={eventTimeFormat}
            eventClick={handleEventClick}
            events={calendarList}
            buttonText={buttonText}
            eventDrop={draganddrop}
          />
        </CardBody>
      </Card>
{
  isOpenScheduleModal === true ?
  <AddScheduleModal
        isOpenScheduleModal={isOpenScheduleModal}
        setIsOpenScheduleModal={setIsOpenScheduleModal}
        // initialEvents={initialEvents}
        // setInitialEvents={setInitialEvents}
        calendarList={calendarList}
        setCalendarList={setCalendarList}
        addScheduleStartDate={addScheduleStartDate}
        setAddScheduleStartDate={setAddScheduleStartDate}
        addScheduleEndDate={addScheduleEndDate}
        setAddScheduleEndDate={setAddScheduleEndDate}
        addcallback={addcallback}
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
      // setInitialEvents={setInitialEvents}
      modalEventContent={modalEventContent}
      // setModalEventContent = {setModalEventContent}
      scheduledetailData = {detailData}
      updatecallback = {updateData}
      deletecallback = {deletecallback}
      />
      :
      null
    }

    </>
    
  );

};

export default Calendar;