import React, { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import AppContext, { ActivityContext } from '../../context/Context';
import { localIp } from '../../config';
import { historyReducer } from '../../reducers/historyReducer';

const ActivityProvider = ({ children }) => {
  const [activityLog, activityLogDispatch] = useReducer(historyReducer, []);
  useEffect(() => {
    const run = async projectNo => {
      // const response = await axios.get(`${localIp}/haru/api/history/${projectNo}`);
      const response = await axios.get(`${localIp}/haru/api/history/1`);
      console.log(response.data);
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
    activityLog,
    activityLogDispatch
  };
  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
};

export default ActivityProvider;
