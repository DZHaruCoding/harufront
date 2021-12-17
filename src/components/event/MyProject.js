  import React, { useCallback, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../context/Context';
import Member from './Member';
import { Button, Media,FormGroup, Label, Modal,Input } from 'reactstrap';
import EventDetailsForm from './EventDetailsForm';
import styles from './modal.scss';
import Datetime from 'react-datetime';
import { localIp } from '../../config';
import '../../assets/scss/cardTest.scss';

const Project = ({project, callback}) => {
  const {setProjectNo, setProjectTitle, projectNo, projectTitle} = useContext(AppContext);

  const members = project.members;
  const [m,setM] = useState(members);
  //DetailModal 상태
  const [projectDetailModal, setProjectDetailModal] = useState(false);

  //UpdateModal 상태
  const [pojectUpdateModal, setProjectUpdateModal] = useState(false);

  //디테일 버튼 클릭
  const btnclick = () =>{
    setProjectDetailModal(true);
    console.log(project.projectNo);

  }

  //프로젝트 생성,업데이트 모달 끄기
  const modalFalse = () =>{
    setProjectDetailModal(false);
    setProjectUpdateModal(false);
    setMemberInputOpen(false);
    setSearchMembers([]);

  }

  //프로젝트 업데이트 모달창 띄우기
  const projectUpdate = () =>{
    setProjectUpdateModal(true);
    setProjectDetailModal(false);
    setMSelects([]);
    //
  }

  //업데이트 모달창 (input)
  const [keyword,setKeyword] = useState('');
  const [mSelects, setMSelects] = useState();
  const [formObj, setFormObj] = useState([]);
  const [projectUpdateTitle,setProjectUpdateTitle] = useState(project.projectTitle);
  const [projectUpdateDesc,setProjectUpdateDesc] = useState(project.projectDesc);
  const [startDate, setStartDate] = useState(project.projectStart);
  const [endDate, setEndDate] = useState(project.projectEnd);

  const modalhandleChange = (target) =>{
    switch (target.name) {
        case 'projectUpdateTitle':
            setProjectUpdateTitle(target.value);
            let name1 = target.name
            let value1 = name1 === 'projectTitle' ? target.checked : target.value;
            console.log('제목 입력 :',value1);
            setFormObj({ ...formObj, [name1]: value1 });           
            break;
        case 'projectUpdateDesc':
              setProjectUpdateDesc(target.value);
              console.log('내용 왜 안들어옴?',target.value);
              let name4 = target.name
              let value4 = name4 === 'projectDesc' ? target.checked : target.value;
              console.log('내용 입력 :',value4);
              setFormObj({ ...formObj, [name4]: value4 });           
              break;       
        case 'projectUpdateStart':
            setStartDate(target.value);
            let name2 = target.name
            let value2 = name2 === 'allDay' ? target.checked : target.value ;
            console.log('시작일 :',value2);
            setFormObj({ ...formObj, [name2]: value2 });              
            break;
        
        case 'projectUpdateEnd':
            setEndDate(target.value);
            let name3 = target.name
            let value3 = name3 === 'allDay' ? target.checked : target.value ;
            console.log('마감일 :',value3);
            setFormObj({ ...formObj, [name3]: value3 });                 
            break;
        default:
            
            break;
    }
  }
  //멤버 클릭 시 중복 제거
  const memberselect = (userNo,userName,userEmail,userPhoto) =>{
    console.log("클릭된 유저 no :",userNo,userName,userEmail,userPhoto)
    console.log('기존 멤버',members);

    // setMSelects([members]);
    const data = {
      userNo: userNo,
      userName: userName,
      userEmail: userEmail,
      userPhoto: userPhoto
    }
    
    //멤버 클릭 중복 제거
    let a = false;
    for(let i = 0; i<m.length; i++){
      if(data.userNo == m[i].userNo){
        
        a = true;
        return;
      }
    }
    if(a==true){
      return;
    }
    console.log('상태값 들어감??????????',mSelects)
    setM([...m,data])
    // setMembers
  }
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

  const pUpdate = () => {
    console.log('업데이트 멤버 목록',m);
    console.log('내용,',formObj);
    //업데이트 fetch
    let data ={
      projectNo : project.projectNo,
      projectTitle : formObj.projectUpdateTitle,
      projectDesc : formObj.projectUpdateDesc,
      projectStart : formObj.projectUpdateStart,
      projectEnd : formObj.projectUpdateEnd
    }

    data.members = m;

    console.log('!!!!!!!!!',data);
    const fetchfun = async() =>{
      const response = await fetch(`${localIp}/api/project/update`,{
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
      console.log('update',jsonResult.data);
      callback(true);
      setProjectUpdateModal(false);
    } 
    fetchfun();
  }
    return(
      
      <Media 
        body 
        className="position-relative pl-3"
        style={{
          flexWrap: "wrap",
          flexDirection: "row"
        }}>
 
          <div style={{display:"flex"}}>
          
          <div style={{display:"flex"}}>
          <h6 className="fs-0 mb-1 " style={{color:"red"}}>
            제목 : {' '}
            {/* <Button className="ml-5">수정</Button> */}
            <Link to={{pathname:"/kanban" ,state:{ projectNo:project.projectNo, projectTitle:project.projectTitle} }}>{project.projectTitle}</Link>
          </h6>
          </div>
            <Button onClick={ () => { btnclick() }}>*</Button>
          </div>

          <p className="mb-1">
           내용 : {' '}
              {project.projectDesc}
          </p>
          <p className="mb-1">
           시작일 :{' '}
              {project.projectStart}
          </p>
          <p className="mb-1">
           마감일 :{' '}
              {project.projectEnd}
          </p>
          <p className="mb-1">
           멤버 :{' '}
              {
                members.map( member => <Member member={member}/>)
              }
          </p>

          {/* DetailModal 모달창 생성 */}
          {
            projectDetailModal == false?
            null
            :
          <Modal
          isOpen = {projectDetailModal}
          onRequestClose = { () => setProjectDetailModal(false)}
          shouldCloseOnOverlayClick={ true } 
          className={ styles.Modal }
          overlayClassName={ styles.Overlay }  
          contentLabel='프로젝트 생성'
          
          >
          <div className='modal-content p-3'> 
            <headers className="bg-light d-flex flex-between-center border-bottom-0">
              <h1>{project.projectTitle}{' '}프로젝트</h1>
              <button onClick={ () => modalFalse() }> Close</button>
            </headers>
            
            <body className='p-2'>
          <FormGroup>
            <Label className="fs-0" for="eventTitle" style={{color : "black", fontWeight: "bold"}}>
              제목
            </Label>
            <br/>
            <label style={{color : "#27BCFD",fontSize: "20px"}}>
              {project.projectTitle}
            </label>
            <Label>
              
            </Label>
          </FormGroup>

          <FormGroup>
            <Label className="fs-0" for="eventTitle" style={{color : "black", fontWeight: "bold"}}>
              내용
            </Label>
            <br/>
            <p style={{fontWeight: "bold",fontSize: "20px"}}>
              {project.projectDesc}
            </p>
          </FormGroup>
          
          <FormGroup>
            <Label className="fs-0" for="eventStart" style={{color : "black", fontWeight: "bold"}}>
              시작일
            </Label>
            <br/>
            <p style={{fontWeight: "bold",fontSize: "20px"}}>
              {project.projectStart}
            </p>

          </FormGroup>
      
          <FormGroup>
            <Label className="fs-0" for="eventEnd" style={{color : "black", fontWeight: "bold"}}>
              마감일
            </Label>
            <br/>
            <p style={{fontWeight: "bold",fontSize: "20px"}}>
              {project.projectEnd}
            </p>
          </FormGroup>

          <FormGroup >
            <Label className="fs-0" for="eventEnd" style={{color : "black", fontWeight: "bold"}}>
              멤버
            </Label>
            <div style={{marginLeft:"20px"}}>
            {
                members.map( member => <Member member={member}/>)
            }
            </div>
          </FormGroup>
          
          <FormGroup style={{alignItems:'flex-center'}}>
              <Button  onClick={ () => {projectUpdate() }}>수정</Button>
              <Button style={{alignItems:'flex-center', marginLeft:"10px",marginRight:"10px"}} onClick={ () => { modalFalse() }}>확인</Button>
          </FormGroup>
            </body>
          </div>
        </Modal>
        // end DetailModal
          }   

          {/* UpdateModal 업데이트 모달창 */}
          {
            pojectUpdateModal == false ?
            null :
            <Modal
            isOpen={pojectUpdateModal}
            onRequestClose = { () => setProjectUpdateModal(false)}
            shouldCloseOnOverlayClick={ true } 
            className={ styles.Modal }
            overlayClassName={ styles.Overlay }  
            >
            
            <div className='modal-content p-3'> 
            <headers className="bg-light d-flex flex-between-center border-bottom-0">
              <h1>프로젝트 수정</h1>
              <button onClick={ () => modalFalse() }> Close</button>
            </headers>
            
            <body className='p-2'>
          <FormGroup>
            <Label className="fs-0" for="eventTitle">
              제목
            </Label>
            <Input name="projectUpdateTitle" id="eventTitle" value={projectUpdateTitle} required onChange={({ target }) => modalhandleChange(target)} ></Input>
          </FormGroup>

          <FormGroup>
            <Label className="fs-0" for="eventDesc">
              내용
            </Label>
            <Input name="projectUpdateDesc" id="eventDesc" value={projectUpdateDesc} required onChange={({ target }) => modalhandleChange(target)} ></Input>
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
                  date.name = 'projectUpdateStart';
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
                  date.name = 'projectUpdateEnd';
                  modalhandleChange(date);
                }
              }}
              dateFormat="YYYY-DD-MM HH:mm:ss"
              inputProps={{ placeholder: 'YYYY-DD-MM HH:mm:ss', id: 'eventEnd' }}
            />
          </FormGroup>

          <FormGroup>
            <Label className="fs-0" for="eventEnd">
              멤버 추가
            </Label>
            <br/>
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
                <div className='mt-2'>
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
          <Label className="fs-0" for="eventEnd">
              추가된 멤버 Update
            </Label>
              {
                !mSelects ?
                null 
                :
                <div style={{marginLeft:"20px"}}>
                  {
                    m
                      .map(mlist => <div> <div>{mlist.userName}{mlist.userEmail}</div> </div>)
                  }
                </div>
              }
              
              
          </FormGroup>
          
          <FormGroup>
              <Button style={{alignItems:'flex-center'}} onClick={ () => {pUpdate()}}>확인</Button>
          </FormGroup>
            </body>
          </div>
            </Modal>
          }
        </Media>
      );    
    };

export default Project;