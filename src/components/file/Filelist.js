import React, { Fragment, useContext, useEffect, useReducer, useState } from 'react';
import AppContext, { ProductContext } from '../../context/Context';
import { Card, CardBody, Col, Media, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import ButtonIcon from '../common/ButtonIcon';

const Filelist = ({ fileNo }) => {
  const { products, productsDispatch } = useContext(ProductContext);

  const { originName, tasklistName, taskNo, fileRegdate, fileMaker } = products.find(
    product => product.fileNo === fileNo
  );
  function downloadFile() {
    console.log('다운로드');
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
              <div
                className="fs--2 fs-md--1 text-danger cursor-pointer"
                onClick={() =>
                  productsDispatch({
                    type: 'REMOVE',
                    payload: {
                      fileNo
                    }
                  })
                }
              >
                Remove
              </div>
            </Media>
          </Row>
        </Media>
      </Col>
      <Col xs={9} md={2} className="p-2 px-md-3">
        {originName}
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
              onClick={() => downloadFile()}
            >
              Download
            </ButtonIcon>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Filelist;
