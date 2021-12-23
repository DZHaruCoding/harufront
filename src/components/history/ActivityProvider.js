import React, { useContext, useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import AppContext, { ActivityContext, KanbanContext } from '../../context/Context';
import { localIp } from '../../config';
import { historyReducer } from '../../reducers/historyReducer';

const ActivityProvider = ({ children }) => {
  const { projectNo, activityLog, activityLogDispatch } = useContext(AppContext);
  useEffect(() => {
    const run = async () => {
      try {
        const response = await fetch(`/haru/api/history/${projectNo}`, {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }

        //response 데이터 json으로 변환하기
        const jsonResult = await response.json(); //여기서부터 오류 null값..

        console.log('리스폰스 :', response);
        console.log('제이슨리졸트 :', jsonResult);
        console.log('제이슨리졸트데이터 :', jsonResult.data);

        //통신 했지만 결과값이 success가 아니면
        if (jsonResult.result !== 'success') {
          throw new Error(`${jsonResult.result} ${jsonResult.message}`);
        }
        const AddArr = jsonResult.data;
        activityLogDispatch({
          type: 'ALADD',
          payload: {
            AddArr
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    run();
  }, []);

  const value = {
    projectNo,
    activityLog,
    activityLogDispatch
  };
  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
};

export default ActivityProvider;
