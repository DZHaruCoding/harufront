import React from 'react';
import MyProject from './MyProject';
import { Media } from 'reactstrap';

const EventSummary = ({ projects, rendcallback,key }) => {
  const updatecallback = () =>{
    rendcallback(true);
  }

  const deletecallback = () => {
    rendcallback(true);
  }

  return(
    <Media>
    {
      projects.map( (project) =>
      <MyProject project={project}
                 callback={updatecallback}
                 deletecallback={deletecallback}
                 key={`${project.projectNo}`}
       />)
    }
    </Media>
    );
};

export default EventSummary;
