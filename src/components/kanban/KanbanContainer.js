import React, { useContext, useRef, useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import is from 'is_js';

import { KanbanContext } from '../../context/Context';
import { isIterableArray } from '../../helpers/utils';
import KanbanColumn from './KanbanColumn';
import AddAnotherList from './AddAnotherList';
import KanbanModal from './KanbanModal';
import { localIp } from '../../config';
import SockJS from 'sockjs-client';
import StompJs from 'stompjs';
import SockJsClient from 'react-stomp';
import { Fragment } from 'react';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {

  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const KanbanContainer = () => {
  const { kanbanColumns, UpdateColumnData, modalContent, modal, setModal } = useContext(KanbanContext);
  const { kanban2, UpdateColumnData2, kanbanDispatch2} = useContext(KanbanContext);
  const containerRef = useRef(null);
  let clientRef = useRef(null);
  const [kanban, setKanban] = useState();
  const API_URL = "http://localhost:8080/haru";

  // Detect device
  useEffect(() => {
    if (is.ipad()) {
      containerRef.current.classList.add('ipad');
    }
    if (is.mobile()) {
      containerRef.current.classList.add('mobile');
      if (is.safari()) {
        containerRef.current.classList.add('safari');
      }
      if (is.chrome()) {
        containerRef.current.classList.add('chrome');
      }
    }
  }, []);

  const getList = id => {
    const targetColumn = kanbanColumns.find(item => item.taskListNo == id);
    return targetColumn.taskVoList;
  };

  const onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(getList(source.droppableId), source.index, destination.index);
      const column = kanbanColumns.find(item => item.taskListNo == source.droppableId);
      // update individual column
      UpdateColumnData(column, items);
    } else {
      const result = move(getList(source.droppableId), getList(destination.droppableId), source, destination);

      const sourceColumn = kanbanColumns.find(item => item.taskListNo == source.droppableId);
      const destinationColumn = kanbanColumns.find(item => item.taskListNo == destination.droppableId);
      // update source
      UpdateColumnData(sourceColumn, result[source.droppableId]);

      //destination update
      UpdateColumnData(destinationColumn, result[destination.droppableId]);
    }
  };

  

  // isIterableArray
  return (
    <Fragment>
      {/* <SockJsClient
          url={`${API_URL}/socket`}
          topics={[`/topic/kanban`]}
          onMessage={mes => {console.log("테스트")}}
          ref={(client) => {
            clientRef = client
          }}
      /> */}
      {/* window.sessionStorage.getItem('authUserName') */}
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban-container scrollbar" ref={containerRef}>
        {kanbanColumns &&
          kanbanColumns.map((kanbanColumnItem, index) => {
            return <KanbanColumn kanbanColumnItem={kanbanColumnItem} key={kanbanColumnItem.taskListNo} index={kanbanColumnItem.taskListNo} />;
          })}
        <AddAnotherList />
        <KanbanModal modal={modal} setModal={setModal} modalContent={modalContent} />
      </div>
    </DragDropContext>
    </Fragment>
  );
};

export default KanbanContainer;
