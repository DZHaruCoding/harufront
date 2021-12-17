import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  CustomInput
} from 'reactstrap';
import Datetime from 'react-datetime';
import Flex from '../common/Flex';
import { localIp } from '../../config';
import _, { set } from 'lodash';

const UpdateScheduleModal = ({
  setIsOpenScheduleModal,
  isOpenScheduleModal,
  setInitialEvents,
  initialEvents,
  addScheduleStartDate,
  callback,
  no,
  title,
  start,
  end,
  eventData
}) => {

  const toggle = () => setIsOpenScheduleModal(!isOpenScheduleModal);

  const [formObj, setFormObj] = useState([]);
  const [endDate, setEndDate] = useState(end);
  const [startDate, setStartDate] = useState(start);
  const [bbb,setBbb] = useState(title);



  const closeBtn = (
    <button className="close font-weight-normal" onClick={toggle}>
      &times;
    </button>
  );

  const handleChange = target => {
    // if(target.name === 'scheduleStart' || 'scheduleEnd'){
    //     let name = target.name
    //     let value = name === 'scheduleStart' || 'scheduleEnd' ? target.checked : target.value ;
    //     console.log('날짜 입력 :',value);
    //     setFormObj({ ...formObj, [name]: value });     
    // }else{
    //     setBbb(target.value);
    //     let name = target.name
    //     let value = name === 'scheduleStart' || 'scheduleEnd' ? target.checked : bbb ;
    //     console.log('제목 입력 :',value);
    //     setFormObj({ ...formObj, [name]: value }); 
    // } 
    // setBbb(target.value);
    // let name =  target.name === 'scheduleContents' ? setBbb(target.value) : target.name;
    // // let name = Object.assign({}, title, target.name);
    // // let value = name === 'allDay' ? target.checked : target.value;
    // let value = name === 'allDay' ? target.checked : bbb ;
    // console.log('bbb :',value);
    // setFormObj({ ...formObj, [name]: value });

    switch (target.name) {
        case 'scheduleContents':
            setBbb(target.value);
            let name1 = target.name
            let value1 = name1 === 'scheduleContent' ? target.checked : target.value;
            console.log('제목 입력 :',value1);
            setFormObj({ ...formObj, [name1]: value1 });           
            break;
        
        case 'scheduleStart':
            setStartDate(target.value);
            let name2 = target.name
            let value2 = name2 === 'allDay' ? target.checked : target.value ;
            console.log('시작일 :',value2);
            setFormObj({ ...formObj, [name2]: value2 });              
            break;
        
        case 'scheduleEnd':
            setEndDate(target.value);
            let name3 = target.name
            let value3 = name3 === 'allDay' ? target.checked : target.value ;
            console.log('마감일 :',value3);
            setFormObj({ ...formObj, [name3]: value3 });                 
            break;
        default:
            break;
    }
     
  };

const handleUpdate = (formObj) =>{
  const update = async() => {
  try {
    const response = await fetch('/haru/api/calendar/update/'+no,{
      method : "put",
      headers:{
        'Content-Type':'application/json',
        'Accept':'application/json'
      },
      body:JSON.stringify(formObj)
    });

    if(!response.ok){
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const jsonResult = await response.json();
    console.log('update',jsonResult.data);
    let data ={
      id:jsonResult.data.scheduleNo,
      title: jsonResult.data.scheduleContents,
      start: jsonResult.data.scheduleStart,
      end: jsonResult.data.scheduleEnd
    };
    // console.log('update fetch 확인 데이터 : ',data);
    // setInitialEvents([initialEvents, data]);

    callback(data)


  } catch (error) {
    console.log(error);
  }
}
update();
};

const [detailData, setDetailData] = useState();

  // no 값 이용해서 일정 정보 값 가져오기
  useEffect(() => {
    const scheduleDetail = async() => {  
         try {
            const response = await fetch(`${localIp}/api/calendar/detail/`+no,{
                method: "get",
                headers:{
                    'Content-Type':'application/json',
                    'Accept':'application/json'
                },
                body: null
            });

            console.log('업데이트 통신 데이터',response);
            //fetch 성공하면
            if(!response.ok){
                throw new Error(`${response.status} ${response.statusText}`);
            }
            //response 데이터 json으로 변환하기
            const jsonResult = await response.json(); //여기서부터 오류 null값..
           
            console.log('개인일정 정보',jsonResult.data);

                  //통신 했지만 결과값이 success가 아니면
            if(jsonResult.result !== 'success'){
            throw new Error(`${jsonResult.result} ${jsonResult.message}`);
            }

            setDetailData(jsonResult.data);

      } catch (error) {
         console.log(error); 
      }
    };
    scheduleDetail();
  }, []);

  return (
    <Modal isOpen={isOpenScheduleModal} toggle={toggle} modalClassName="theme-modal" contentClassName="border">
      <Form
        onSubmit={e => {
          e.preventDefault();
          handleUpdate(formObj);
          setIsOpenScheduleModal(false);
        }}
      >
        <ModalHeader toggle={toggle} className="bg-light d-flex flex-between-center border-bottom-0" close={closeBtn}>
          일정 수정 {no}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label className="fs-0" for="eventTitle">
              제목
            </Label>

            <Input name="scheduleContents" id="eventTitle" value={bbb}
            required onChange={({ target }) => handleChange(target)} />
          </FormGroup>

          <FormGroup>
            <Label className="fs-0" for="eventStart">
              시작일
            </Label>

            {/* 시작일 날짜 */}
            <Datetime
              timeFormat={true}
              //addScheduleStartDate = 부모에서 모달창 클릭 했을때 받아오는 날짜 데이터
              value={ startDate}
              onChange={dateTime => {
                if (dateTime._isValid) {
                  setStartDate(dateTime);
                  let date = {};
                  date.value = dateTime.format('YYYY-MM-DD HH:mm:ss');
                  date.name = 'scheduleStart';
                  handleChange(date || addScheduleStartDate);
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
          
        </ModalBody>
        <ModalFooter tag={Flex} justify="end" align="center" className="bg-light border-top-0">

          <Button color="primary" type="submit" className="px-4">
            수정
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default UpdateScheduleModal;
