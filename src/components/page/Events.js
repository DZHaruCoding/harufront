import React, {useEffect, useState} from 'react';
import { Alert, Button, Card, CardBody, Col, CustomInput, Form, Modal, Row,FormGroup,Label,Input, NavLink, } from 'reactstrap';
import EventSummary from '../event/EventSummary';
import Loader from '../common/Loader';
import FalconCardHeader from '../common/FalconCardHeader';
import useFakeFetch from '../../hooks/useFakeFetch';
import rawEvents from '../../data/event/events';
import eventCategories from '../../data/event/eventCategories';
import createMarkup from '../../helpers/createMarkup';
import { isIterableArray } from '../../helpers/utils';
import { localIp } from '../../config';
import ReactModal from "react-modal";
import styles from './modal.scss';
import { flexibleCompare } from '@fullcalendar/react';
import Datetime from 'react-datetime';
import { Link } from 'react-router-dom';



const Events = () => {
  const { loading, data: events } = useFakeFetch(rawEvents);
  const [projects,setProjects] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [formObj, setFormObj] = useState();
  const [endDate, setEndDate] = useState();
  const [startDate, setStartDate] = useState();
  
  const handleChange = target => {
    let name = target.name;
    let value = name === 'allDay' ? target.checked : target.value;
    setFormObj({ ...formObj, [name]: value });
    console.log('모달창 데이터',formObj);  
  };
  //useEffect에 async 바로 주지말고 함수 만들어서 함수에 async
  useEffect( () => {
    const data = async ()=>{ 
    try {
      const response = await fetch(`${localIp}/api/project/1`,{
        method: 'get',
        headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: null
      });

      //성공하면
      if(!response.ok){
          throw new Error(`${response.status} ${response.statusText}`);
      }
      //결과를 json으로 변환
      const jsonResult = await response.json();
      console.log(jsonResult.data);
      //통신은 했지만 결과값이 success가 아니면 
      if(jsonResult.result !== 'success'){
          throw new Error(`${jsonResult.result} ${jsonResult.message}`);
      }

      // setEmails에 데이터 셋팅하기
      setProjects(jsonResult.data);

    } catch (error) {
      console.log(error);
    }
  }
  data();
  },[]);
  
  return (
    <Card>
      <FalconCardHeader title="내 프로젝트">
        {/* {isIterableArray(eventCategories) && (
          <Form inline>
            <CustomInput type="select" id="customSelectCategory" name="customSelectCategory" bsSize="sm">
              {eventCategories.map((option, index) => (
                <option value={index} key={index}>
                  {option}
                </option>
              ))}
            </CustomInput>
          </Form>
        )} */}
        <Button color='info' onClick={ () => { setModalIsOpen(true) }}>프로젝트 생성</Button>
        <Modal
          isOpen = {modalIsOpen}
          onRequestClose = { () => setModalIsOpen(false)}
          shouldCloseOnOverlayClick={ true } 
          className={ styles.Modal }
          overlayClassName={ styles.Overlay }  
          contentLabel='프로젝트 생성'
          >
          <div className='modal-content'> 
            <headers className="bg-light d-flex flex-between-center border-bottom-0">
              <h1>프로젝트 생성 모달창</h1>
              <button onClick={ () => setModalIsOpen(false)}> Close</button>
            </headers>
            
            <body>
            <FormGroup>
            <Label className="fs-0" for="eventTitle">
              제목
            </Label>
            <Input name="scheduleContents" id="eventTitle"><Link to='#'/></Input>
          </FormGroup>

          <FormGroup>
            <Label className="fs-0" for="eventStart">
              시작일
            </Label>
            {/* 시작일 날짜 */}
          
            <Datetime
              timeFormat={true}
              //addScheduleStartDate = 부모에서 모달창 클릭 했을때 받아오는 날짜 데이터
              value={ startDate }
              onChange={dateTime => {
                if (dateTime._isValid) {
                  setStartDate(dateTime);
                  let date = {};
                  date.value = dateTime.format('YYYY-MM-DD HH:mm:ss');
                  date.name = 'scheduleStart';
                  handleChange(date);
                }
              } //onChange 끝
              
            }
              
              dateFormat="YYYY-DD-MM HH:mm:ss"
              inputProps={{ placeholder: 'YYYY-MM-DD HH:mm:ss', id: 'eventStart' }}
            />
          </FormGroup>
      
          <FormGroup>
            <Label className="fs-0" for="eventEnd">
              마감일
            </Label>
            {/* 마감일 날짜 */}
            <Datetime
              value={endDate}
              timeFormat={true}
              onChange={dateTime => {
                if (dateTime._isValid) {
                  setEndDate(dateTime);
                  let date = {};
                  date.value = dateTime.format('YYYY-MM-DD HH:mm:ss');
                  date.name = 'scheduleEnd';
                  handleChange(date);
                }
              }}
              dateFormat="YYYY-DD-MM HH:mm:ss"
              inputProps={{ placeholder: 'YYYY-DD-MM HH:mm:ss', id: 'eventEnd' }}
            />
          </FormGroup>

          <FormGroup>
            <h3>멤버 추가</h3>
            <button>+</button> <input id="member" name="meber" onChange={ () => {}}/>

          </FormGroup>

            </body>
          </div>
        </Modal>
        {/* end 프로젝트 생성 모달창 */}


      </FalconCardHeader>
      <CardBody className="fs--1">
        {loading ? (
          <Loader />
        ) : isIterableArray(events) ? (
          <EventSummary  projects={projects}/>
        ) : (
          <Alert color="info" className="mb-0">
            No events found!
          </Alert>
        )}
      </CardBody>
    </Card>
  );
};

export default Events;
