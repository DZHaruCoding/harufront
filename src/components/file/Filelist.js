import React, { Fragment, useContext, useEffect, useReducer, useState } from 'react';
import AppContext, { ProductContext } from '../../context/Context';
import { Card, CardBody, Col, Media, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import ButtonIcon from '../common/ButtonIcon';
import excelimg from '../../assets/img/excel.png';
import txtimg from '../../assets/img/txt.png';
import attachimg from '../../assets/img/attach.png';
import { localIp } from '../../config';
import axios from 'axios';
import { Image } from 'react-bootstrap';
const API_URL = 'http://localhost:8080';
const Filelist = ({ fileNo }) => {
  const { products, productsDispatch } = useContext(ProductContext);

  const { originName, tasklistName, filePath, fileRegdate, fileMaker } = products.find(
    product => product.fileNo === fileNo
  );

  function downloadData(fileNo) {
    //blob : 이미지, 사운드, 비디오와 같은 멀티미디어 데이터를 다룰 때 사용, MIME 타입을 알아내거나, 데이터를 송수신
    fetch(`${API_URL}/haru/api/download/${fileNo}`).then(response => {
      console.log(`${fileNo}`);
      const filename = response.headers.get('Content-Disposition').split('filename=')[1];
      console.log(filename);
      response.blob().then(blob => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
      });
    });
  }

  return (
    <Row noGutters className="align-items-center px-1 border-bottom border-200">
      <Col xs={9} md={2} className="p-2 px-md-3">
        <Media className="align-items-center">
          <Link to={`#`} />
          <Row>
            <Media body>
              <h4 className="fs-0">
                <Link className="text-800" to={`#`}>
                  {originName}
                </Link>
              </h4>
              <div className="fs--2 fs-md--1 text-danger cursor-pointer" onClick={() => onClickDeleteFile(fileNo)}>
                Remove
              </div>
            </Media>
          </Row>
        </Media>
      </Col>
      <Col xs={9} md={2} className="p-2 px-md-3">
        {originName.split('.')[1] === 'csv' || originName.split('.')[1] === 'xlxs' ? (
          <Image src={excelimg} alt={originName} onClick={() => onClickDeleteFile(fileNo)} style={{ width: '50%' }} />
        ) : (
          <>
            {originName.split('.')[1] === 'txt' ? (
              <Image src={txtimg} alt={originName} onClick={() => downloadFile(fileNo)} style={{ width: '50%' }} />
            ) : (
              <>
                {originName.split('.')[1] === 'png' || originName.split('.')[1] === 'jpg' ? (
                  <Image
                    src={`${API_URL}/haru${filePath}`}
                    alt={originName}
                    onClick={() => downloadFile(fileNo)}
                    style={{ width: '50%' }}
                  />
                ) : (
                  <Image
                    src={attachimg}
                    alt={originName}
                    onClick={() => downloadFile(fileNo)}
                    style={{ width: '50%' }}
                  />
                )}
              </>
            )}
          </>
        )}
      </Col>
      <Col xs={3} md={8} className="px-3">
        <Row>
          <Col md={1} className="p-2 px-md-3" />
          <Col md={3} className="p-2 px-md-3">
            {tasklistName}
          </Col>
          <Col md={3} className="p-2 px-md-3">
            {fileRegdate}
          </Col>
          <Col md={3} className="p-2 px-md-3">
            {fileMaker}
          </Col>
          <Col md={2} className="text-right pl-0 pr-2 pr-md-3 order-0 order-md-1 mb-2 mb-md-0 text-600">
            <ButtonIcon
              color="outline-primary"
              size="sm"
              icon="cart-plus"
              iconClassName="ml-2 d-none d-md-inline-block"
              onClick={() => downloadFile(fileNo)}
            >
              Download
            </ButtonIcon>
          </Col>
        </Row>
      </Col>
    </Row>
  );

  function downloadFile(fileNo) {
    if (window.confirm('파일을 다운로드 하시겠습니까?')) {
      downloadData(fileNo);
    }
  }
  // .filter(item => {
  //   item.fileNo !== `${payload.fileNo}`;
  // });
  //파일 삭제하기
  function onClickDeleteFile(fileNo) {
    if (window.confirm('파일을 삭제하시겠습니까?')) {
      axios
        .delete(`/haru/api/file/del/${fileNo}`)
        .then(
          productsDispatch({
            type: 'FREMOVE',
            payload: {
              fileNo
            },
            id: fileNo
          })
        )
        .catch(console.error());
    }
  }
};

export default Filelist;
