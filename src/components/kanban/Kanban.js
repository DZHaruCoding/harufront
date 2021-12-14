import React, { useContext, useEffect } from 'react';
// import { TouchBackend } from 'react-dnd-touch-backend';

import AppContext from '../../context/Context';
import KanbanHeader from './KanbanHeader';
import KanbanContainer from './KanbanContainer';
import KanbanProvider from './KanbanProvider';
import kanbanService from '../../service/kanbanService';

const Kanban = ({location}) => {
  const { setIsNavbarVerticalCollapsed } = useContext(AppContext);
  const {setProjectNo, setProjectTitle} = useContext(AppContext);
  setProjectNo(location.state.projectNo);
  setProjectTitle(location.state.projectTitle);
  console.log(location.state.projectNo);
  console.log(location.state.projectTitle);
  useEffect(() => {
    document.getElementsByTagName('body')[0].classList.add('overflow-hidden');
    setIsNavbarVerticalCollapsed(true);
    return () => {
      document.getElementsByTagName('body')[0].classList.remove('overflow-hidden');
    };
  }, [setIsNavbarVerticalCollapsed]);

  return (
    <>
      <KanbanHeader />
      <KanbanProvider>
        <KanbanContainer />
      </KanbanProvider>
    </>
  );
};

export default Kanban;
