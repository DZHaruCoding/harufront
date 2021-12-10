import React from 'react';
import MyProject from './MyProject';
import { Media } from 'reactstrap';

const EventSummary = ({ projects }) => {
  return(
    <Media >
    {
      projects.map( project =>
      <MyProject project={project}/>)
    }
    </Media>
    );
};

export default EventSummary;
