import React from 'react';
import orderBy from 'lodash/orderBy';
import { toast } from 'react-toastify';
import { localIp } from '../config';

export const historyReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'ADD': {
      return payload.data;
    }
  }
};
