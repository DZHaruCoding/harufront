import React from 'react';
import orderBy from 'lodash/orderBy';
import { toast } from 'react-toastify';
import { localIp } from '../config';
import axios from 'axios';
import { update } from 'lodash';

export const fileReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'FADD':
      return [...state, ...payload.data];
    case 'FREMOVE':
      console.log('리듀서 : 삭제하기 발동');
      console.log(`${payload.fileNo}`);
      fetch(`${localIp}/api/file/20`, {
        method: 'delete'
      }).then(response => console.log(response.json()));
      return state;
  }
};
