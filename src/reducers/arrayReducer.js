import React from 'react';
import orderBy from 'lodash/orderBy';
import { toast } from 'react-toastify';
import { localIp } from '../config';

export const arrayReducer = (state, action) => {
  const { type, id, payload, sortBy, order, isAddToStart, isUpdatedStart, isCard } = action;
  switch (type) {
    case 'ALLADD': {
      return payload.data;
    }
    case 'ADD':
      if (!payload) {
        console.error('payload is required!');
        return state;
      }

      if (isCard) {
        if (state.find(item => item.taskNo === payload.taskNo)) {
          toast(<span className="text-warning">Item already exists in the list!</span>);
          return state;
        }
      } else {
        if (state.find(item => item.taskListOrder === payload.taskListOrder)) {
          toast(<span className="text-warning">Item already exists in the list!</span>);
          return state;
        }
      }

      if (isAddToStart) {
        return [payload, ...state];
      }
      return [...state, payload];
    case 'REMOVE':
      if (id !== 0 && !id) {
        console.error('id is required!');
        return state;
      }
      if (isCard) {
        return state.filter(item => item.taskNo !== id);
      } else {
        return state.filter(item => item.taskListNo !== id);
      }
    case 'TASKREMOVE':
      if (id !== 0 && !id) {
        console.error('id is required!');
        return state;
      }
      let item = [...state];

      state.map((item1, i) => (item[i].taskVoList = item1.taskVoList.filter(item2 => item2.taskNo !== id)));

      return item;

    case 'EDIT':
      if (id !== 0 && !id) {
        console.error('id is required!');
        return state;
      }
      if (isUpdatedStart) {
        const filteredState = state.filter(item => item.id !== id);
        return [payload, ...filteredState];
      }

      return state.map(item => (item.taskListNo === id ? payload : item));
    case 'SORT':
      if (!sortBy || !order) {
        console.error('sortBy and order, both are required!');
        return state;
      }
      return orderBy(state, sortBy, order);
    default:
      return state;
  }
};
