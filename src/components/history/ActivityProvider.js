import React, { useContext, useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import AppContext, { ActivityContext, KanbanContext } from '../../context/Context';
import { localIp } from '../../config';
import { historyReducer } from '../../reducers/historyReducer';

const ActivityProvider = ({ children }) => {
  const { projectNo, activityLog, activityLogDispatch } = useContext(AppContext);
  useEffect(() => {
    const run = async () => {
      console.log('projectNo아이이이이이이이', projectNo);
      // const response = await axios.get(`${localIp}/haru/api/history/${projectNo}`);
      const response = await axios.get(`/haru/api/history/${projectNo}`);
      const item = response.data;
      activityLogDispatch({
        type: 'ALADD',
        payload: {
          ...item
        }
      });
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
