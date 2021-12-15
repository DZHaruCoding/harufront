import React, {createContext, useEffect, useState} from 'react';
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
import { offline } from 'is_js';


const Events = () => {
  const { loading, data: events } = useFakeFetch(rawEvents);
  const [projects,setProjects] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [formObj, setFormObj] = useState();
  const [endDate, setEndDate] = useState();
  const [startDate, setStartDate] = useState();

  const [rend, setRend] = useState(false);

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
  },[rend]);
  
  //멤버 인풋
  const [memberInputOpen, setMemberInputOpen] = useState(false);
  const [searchMembers, setSearchMembers] = useState(); 

  const memberSearchandInput = () => {    
    const fetchfun = async () => {
      try {
        const response = await fetch(`${localIp}/api/project/member`,{
          method: 'get',
          headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: null
        });

        console.log('프로젝트 생성 멤버 찾기 @: '+response);


      if(!response.ok){
          throw new Error(`${response.status} ${response.statusText}`);
      }
      //response 데이터 json으로 변환하기
      const jsonResult = await response.json(); //여기서부터 오류 null값..
     
      console.log('프로젝트 생성 멤버 찾기 json data :',jsonResult.data);

            //통신 했지만 결과값이 success가 아니면
      if(jsonResult.result !== 'success'){
      throw new Error(`${jsonResult.result} ${jsonResult.message}`);
      }
      setSearchMembers(jsonResult.data);

      } catch (error) {
        console.log(error);
      }
    }
    fetchfun();
    setMemberInputOpen(true);
  }
  //키워드
  const [keyword,setKeyword] = useState('');
  //선택 된 멤버 담는 상태값
  const [mSelects, setMSelects] = useState([]);
  //멤버 클릭 시
  const memberselect = (userNo,userName,userEmail,userPhoto) =>{
    console.log("클릭된 유저 no :",userNo,userName,userEmail,userPhoto)
    const data = {
      userNo: userNo,
      userName: userName,
      userEmail: userEmail,
      userPhoto: userPhoto
    }

    //멤버 클릭 중복 제거
    let a = false;
    for(let i = 0; i<mSelects.length; i++){
      if(data.userNo == mSelects[i].userNo){
        
        a = true;
        return;
      }
    }
    if(a==true){
      return;
    }
    setMSelects([...mSelects, data]);
  }

  const modalFalse = () =>{
    setModalIsOpen(false)
    setSearchMembers()
    setKeyword('');
    setMSelects([]);
    setMemberInputOpen(false);
  }
  //프로젝트 모달창 input태그 오브젝트로 변환
  const [modalformObj, setModalFormObj] = useState();
  const modalhandleChange = (target) =>{
    let name = target.name;
    let value = name === 'allDay' ? target.checked : target.value;
    setModalFormObj({ ...modalformObj, [name]: value });
  }

  //프로젝트 생성 클릭 시
  const projectAdd = () =>{
    console.log('modalobj:',modalformObj)
    //members
    console.log('finalobj',mSelects);


    modalformObj.members = mSelects;
    console.log(modalformObj)
    // const members = {

    //   members:[mSelects]
    // }

    // console.log('만든 members',members);
    // setModalFormObj({...modalformObj, members});
    console.log(modalformObj);
    const fetchfun = async() => {
        const response = await fetch(`${localIp}/api/project/add/1`,{
          method:"post",
          headers:{
            'Content-Type':'application/json',
            'Accept':'application/json'
          },
          body:JSON.stringify(modalformObj)
        });
        if(!response.ok){
          throw new Error(`${response.status} ${response.statusText}`);
      }
      //response 데이터 json으로 변환하기
      const jsonResult = await response.json(); //여기서부터 오류 null값..
      if(jsonResult.result !== 'success'){
        throw new Error(`${jsonResult.result} ${jsonResult.message}`);
        }
        setProjects([...projects,jsonResult.data]);
        setRend(true);
        modalFalse();
    }
    fetchfun();
    }
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
        
        {/* 프로젝트 생성 모달 창 */}
        <Modal
          isOpen = {modalIsOpen}
          onRequestClose = { () => setModalIsOpen(false)}
          shouldCloseOnOverlayClick={ true } 
          className={ styles.Modal }
          overlayClassName={ styles.Overlay }  
          contentLabel='프로젝트 생성'
          searchMembers={searchMembers}
          setSearchMembers={setSearchMembers}
          >
          <div className='modal-content p-3'> 
            <headers className="bg-light d-flex flex-between-center border-bottom-0">
              <h1>프로젝트 생성</h1>
              <button onClick={ () => modalFalse() }> Close</button>
            </headers>
            
            <body className='p-2'>
          <FormGroup>
            <Label className="fs-0" for="eventTitle">
              제목
            </Label>
            <Input name="projectTitle" id="eventTitle" required onChange={({ target }) => modalhandleChange(target)} ></Input>
          </FormGroup>

          <FormGroup>
            <Label className="fs-0" for="eventTitle">
              내용
            </Label>
            <Input name="projectDesc" id="eventTitle" required onChange={({ target }) => modalhandleChange(target)} ></Input>
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
                  date.name = 'projectStart';
                  modalhandleChange(date);
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
                  date.name = 'projectEnd';
                  modalhandleChange(date);
                }
              }}
              dateFormat="YYYY-DD-MM HH:mm:ss"
              inputProps={{ placeholder: 'YYYY-DD-MM HH:mm:ss', id: 'eventEnd' }}
            />
          </FormGroup>

          <FormGroup>
            <h3>멤버 추가</h3>
            <button onClick={ () => {
              memberSearchandInput();
            }} className='mr-3 '>
              +</button>
              {
              memberInputOpen == false ?
              null
              :
              <input  id="member" name="meber" placeholder='멤버 찾기' value={keyword} onChange={ (e) => { let data = e.target.value; setKeyword(data)}}/>
              }
              {
                !searchMembers ?
                null:
                //멤버 리스트 출력
                <div>
                {
                  searchMembers
                    .filter((searchMember)=> searchMember.userName.indexOf(keyword) !== -1 || searchMember.userEmail.indexOf(keyword) !== -1)
                    .map(searchMember => <div onClick={ ()=>{ memberselect(searchMember.userNo, searchMember.userName, searchMember.userEmail, searchMember.userPhoto)}} 
                    key={searchMember.userNo}><h6>{searchMember.userName}{' '}{searchMember.userEmail}</h6></div>)      
                }
                </div>
              }

          </FormGroup>

          <FormGroup>
              <h3>추가된 멤버</h3>
              {
                !mSelects ?
                null 
                :
                <div>
                  {
                    mSelects
                      .map(mSelect => <div> <div>{mSelect.userName}{mSelect.userEmail}</div> </div>)
                  }
                </div>
              }
              
              
          </FormGroup>
          
          <FormGroup>
              <Button style={{alignItems:'flex-center'}} onClick={ () => {projectAdd()}}>생성</Button>
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
            No events found!Fpro
          </Alert>
        )}
      </CardBody>
    </Card>
  );
};

export default Events;
