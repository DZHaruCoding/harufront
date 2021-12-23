import React, { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import AppContext, { ProductContext } from '../../context/Context';
import { localIp } from '../../config';
import { fileReducer } from '../../reducers/fileReducer';

const FileProvider = ({ children }) => {
  const [products, productsDispatch] = useReducer(fileReducer, []);

  const value = {
    products,
    productsDispatch
  };

  useEffect(() => {
    const pro = async projectNo => {
      // const response = await axios.get(`${localIp}/haru/api/history/${projectNo}`);
      const response = await axios.get(`/haru/api/dashboard/${projectNo}/file`);
      const item = response.data;
      productsDispatch({
        type: 'FADD',
        payload: {
          ...item
        }
      });
    };
    pro();
  }, []);

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export default FileProvider;
