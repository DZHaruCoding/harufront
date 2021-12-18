import React, { useReducer } from 'react';

export const taskSettingReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'ALADD':
      return [...state, ...payload.data];
  }
};
