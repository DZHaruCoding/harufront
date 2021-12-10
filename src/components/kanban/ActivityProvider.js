import React, { useEffect, useReducer, useState } from 'react';
import { KanbanContext } from '../../context/Context';
import { arrayReducer } from '../../reducers/arrayReducer';
import { localIp } from '../../config';
import { ApiHistory, fetchHistory } from '../../service/Api';

const ActivityProvider = ({ children }) => {
  const [activityLog, activityLogDispatch] = useReducer(historyReducer, []);

  const [kanbanColumns, kanbanColumnsDispatch] = useReducer(arrayReducer, []);
  const [kanbanTaskCards, kanbanTaskCardsDispatch] = useReducer(arrayReducer, []);

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
    ApiHistory.fetchHistory(projectNo).then(response =>
      activityLogDispatch({ type: 'ADD', payload: response.data.data })
    );
    const fun = async () => {
      try {
        const response = fetchHistory(projectNo);

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
        taskVoList: requestData
      };

      const response = await fetch(`${localIp}/api/task/dropTask`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
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
    modalContent,
    setModalContent,
    modal,
    setModal
  };
  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
};

export default ActivityProvider;
