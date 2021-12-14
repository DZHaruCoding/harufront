import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../context/Context';
import Member from './Member';

const Project = ({project}) => {
  const {setProjectNo, setProjectTitle, projectNo, projectTitle} = useContext(AppContext);

  const members = project.members;
  console.log('ㅣㅅ시ㅣ시시시시시시시',projectNo)

    return(
        <div className="position-relative  pb-5 w-100">
          <div style={{flex:1}}>
          <h6 className="fs-0 mb-1 " style={{color:"red"}}>
            제목 : {' '}
            {/* <Button className="ml-5">수정</Button> */}
            <Link to={{pathname:"/kanban" ,state:{ projectNo:project.projectNo, projectTitle:project.projectTitle} }}>{project.projectTitle}</Link>
          </h6>
          </div>

          <div style={{flex:1}}>
          <p className="mb-1">
           내용 : {' '}
              {project.projectDesc}
          </p>
          </div>
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
    
        </div>  
      );    
    };

export default Project;