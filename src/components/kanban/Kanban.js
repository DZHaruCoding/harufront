import React, { useContext, useEffect } from 'react';
// import { TouchBackend } from 'react-dnd-touch-backend';

import AppContext from '../../context/Context';
import KanbanHeader from './KanbanHeader';
import KanbanContainer from './KanbanContainer';
import KanbanProvider from './KanbanProvider';
import kanbanService from '../../service/kanbanService';

const Kanban = ({ location }) => {
  const { setIsNavbarVerticalCollapsed } = useContext(AppContext);
  const { setProjectNo, setProjectTitle } = useContext(AppContext);
  useEffect(() => {
    document.getElementsByTagName('body')[0].classList.add('overflow-hidden');
    setIsNavbarVerticalCollapsed(true);
    return () => {
      document.getElementsByTagName('body')[0].classList.remove('overflow-hidden');
    };
  }, [setIsNavbarVerticalCollapsed]);

  useEffect(() => {
    if (location.state) {
      setProjectNo(location.state.projectNo);
      setProjectTitle(location.state.projectTitle);
    }
  }, []);

  return (
    <>
      <KanbanHeader />
      <KanbanProvider
        curprojectNo={location.state ? location.state.projectNo : ''}
        curprojectTitle={location.state ? location.state.projectTitle : ''}
      >
        <KanbanContainer />
      </KanbanProvider>
    </>
  );
};

export default Kanban;
