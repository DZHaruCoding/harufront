import React, { useEffect, useReducer, useState } from 'react';
import { KanbanContext } from '../../context/Context';
import { arrayReducer } from '../../reducers/arrayReducer';

import rawKanbanItems, { rawItems } from '../../data/kanban/kanbanItems';
import { localIp } from '../../config';
import { json } from 'is_js';
import { kanbanList } from '../../service/kanbanService';


const KanbanProvider = ({ children }) => {
  const [kanbanColumns, kanbanColumnsDispatch] = useReducer(arrayReducer, []);
  const [kanbanTaskCards, kanbanTaskCardsDispatch] = useReducer(arrayReducer, rawItems);
  const [kanban2, kanbanDispatch2] = useReducer(arrayReducer, []);

  const [modal, setModal] = useState(false);

  const [modalContent, setModalContent] = useState({});

  const getItemStyle = isDragging => ({
    // change background colour if dragging
    cursor: isDragging ? 'grabbing' : 'pointer',
    transform: isDragging ? 'rotate(-3deg)' : '',
    transition: 'all 0.3s ease-out'

    // styles we need to apply on draggables
  });

  useEffect(() => {
    const fun = async () => {
      try {
        console.log("Asdad");
        const response = await fetch(`${localIp}/api/tasklist/data/2`, {
          method: 'get',
          header: {
            "Content-Type:": 'application/json',
            'Accept': 'application'
          },
          body: null
        });
  
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
  
        const jsonResult = await response.json();
  
        if (jsonResult.result != 'success') {
          throw new Error(`${jsonResult.result} ${jsonResult.message}`);
        }

        const item = jsonResult;
        kanbanColumnsDispatch({
          type: 'ALLADD',
          payload: {
            ...jsonResult,
            item
          },
          id: 1
        });
        console.log(jsonResult.data);
      } catch(err) {
        console.log(err);
      }
    }

    fun();
    
  }, []);

  

  const UpdateColumnData = (column, taskVoList) => {
    kanbanColumnsDispatch({
      type: 'EDIT',
      payload: {
        ...column,
        taskVoList
      },
      id: column.taskListNo
    });
  };

  const UpdateColumnData2 = (column, items) => {
    kanbanDispatch2({
      type: 'EDIT',
      payload: {
        ...column,
        items
      },
      id: column.id
    });
  };

  const value = {
    kanbanTaskCards,
    kanbanTaskCardsDispatch,
    kanbanColumns,
    kanbanColumnsDispatch,
    kanban2,
    kanbanDispatch2,
    getItemStyle,
    UpdateColumnData,
    UpdateColumnData2,
    modalContent,
    setModalContent,
    modal,
    setModal
  };
  return <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>;
};

export default KanbanProvider;
