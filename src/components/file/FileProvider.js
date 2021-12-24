import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import AppContext, { ProductContext } from '../../context/Context';
import { fileReducer } from '../../reducers/fileReducer';

const FileProvider = ({ children }) => {
  const [products, productsDispatch] = useReducer(fileReducer, []);
  const { projectNo } = useContext(AppContext);
  console.log('처음 셋팅하는 products =====>>', products);
  console.log('지금 프로젝트 넘버 projectNO =====>>', projectNo);

  useEffect(() => {
    const pro = async () => {
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
  const value = {
    products,
    productsDispatch
  };
  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export default FileProvider;
