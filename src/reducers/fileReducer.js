import React from 'react';
import orderBy from 'lodash/orderBy';
import { toast } from 'react-toastify';
import { localIp } from '../config';

export const fileReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'FADD':
      return [...state, ...payload.data];
    case 'REMOVE':
      console.log('Remove');
      return state;
  }
};
