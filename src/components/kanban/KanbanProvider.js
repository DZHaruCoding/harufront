import React, { useContext, useEffect, useReducer, useState } from 'react';
import AppContext, { KanbanContext } from '../../context/Context';
import { arrayReducer } from '../../reducers/arrayReducer';

import rawKanbanItems, { rawItems } from '../../data/kanban/kanbanItems';
import { localIp } from '../../config';
import { json } from 'is_js';
import { kanbanList } from '../../service/kanbanService';
import axios from 'axios';

const KanbanProvider = ({ children, curprojectNo, curprojectTitle }) => {
  const [kanbanColumns, kanbanColumnsDispatch] = useReducer(arrayReducer, []);
  const [kanbanTaskCards, kanbanTaskCardsDispatch] = useReducer(arrayReducer, []);
  const [modal, setModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const { projectNo, projectTitle } = useContext(AppContext);

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
        console.log('aaaaaa', projectNo);
        // ${curprojectNo !== '' ? curprojectNo : projectNo}
        const response = await fetch(`/haru/api/tasklist/data/${curprojectNo !== '' ? curprojectNo : projectNo}`, {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
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

        jsonResult.data.map(item =>
          item.taskVoList.map(item2 =>
            kanbanTaskCardsDispatch({
              type: 'ADD',
              payload: item2,
              id: item2.taskNo,
              isCard: true
            })
          )
        );
      } catch (err) {
        console.log(err);
      }
    };

    fun();
  }, []);

  const kanbanAllAdd = column => {
    const item = column;
    kanbanColumnsDispatch({
      type: 'ALLADD',
      payload: {
        ...column,
        item
      },
      id: 1
    });
  };

  const UpdateColumnData2 = (column, taskVoList) => {
    kanbanColumnsDispatch({
      type: 'EDIT',
      payload: {
        ...column,
        taskVoList
      },
      id: column.taskListNo
    });
  }

  const UpdateColumnData = async (column, taskVoList) => {
    kanbanColumnsDispatch({
      type: 'EDIT',
      payload: {
        ...column,
        taskVoList
      },
      id: column.taskListNo
    });

    try {
      const requestData = taskVoList;
      const json = {
        taskListNo: column.taskListNo,
        taskVoList: requestData,
        projectNo: projectNo,
        projectTitle: projectTitle,
        updateTaskList: column
      };

      const response = await fetch(`/haru/api/task/dropTask`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(json)
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const jsonResult = await response.json();

      if (jsonResult.result != 'success') {
        throw new Error(`${jsonResult.result} ${jsonResult.message}`);
      }

      console.log("요청 완료");

      return 'true';
    } catch (err) {
      console.error(err);
      return 'fail';
    }
  };

  const value = {
    kanbanTaskCards,
    kanbanTaskCardsDispatch,
    kanbanColumns,
    kanbanColumnsDispatch,
    getItemStyle,
    UpdateColumnData,
    UpdateColumnData2,
    kanbanAllAdd,
    modalContent,
    setModalContent,
    modal,
    setModal
  };
  return <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>;
};

export default KanbanProvider;
