import React from 'react';
import orderBy from 'lodash/orderBy';
import { toast } from 'react-toastify';
import { localIp } from '../config';
import axios from 'axios';
import { update } from 'lodash';

export const fileReducer = (state, action) => {
  const { type, id, payload, sortBy, order, isAddToStart, isUpdatedStart, isCard } = action;
  switch (type) {
    case 'FADD':
      if (!payload) {
        console.error('payload is required!');
        return state;
      }
      return [...state, ...payload.data];
    case 'FREMOVE':
      if (id !== 0 && !id) {
        console.error('id is required!');
        return state;
      }
      console.log('리듀서 : 삭제하기 발동');
      console.log('reduer에서 ', `${payload.fileNo}`);

      return state.filter(item => item.fileNo !== id);
  }
};
