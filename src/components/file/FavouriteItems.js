import React, { Fragment, useContext, useEffect, useReducer, useState } from 'react';
import AppContext, { ProductContext } from '../../context/Context';
import { Card, CardBody, Col, Media, Row } from 'reactstrap';
import { isIterableArray } from '../../helpers/utils';
import FalconCardHeader from '../common/FalconCardHeader';
import Filelist from './Filelist';

const FavouriteItems = () => {
  const { products, productsDispatch } = useContext(ProductContext);

  return (
    <Card>
      <FalconCardHeader
        title={`FILE LIST (${products.length} Item ${products.length === 1 ? '' : 's'})`}
        light={true}
      />
      <CardBody className="p-0">
        {isIterableArray(products) ? (
          <Fragment>
            <Row noGutters className="bg-200 text-900 px-1 fs--1 font-weight-semi-bold">
              <Col xs={9} md={2} className="p-2 px-md-3">
                img
              </Col>
              <Col xs={9} md={2} className="p-2 px-md-3">
                originName
              </Col>
              <Col xs={3} md={8} className="px-3">
                <Row>
                  <Col md={1} className="p-2 px-md-3" />
                  <Col md={3} className="p-2 px-md-3">
                    tasklistName
                  </Col>
                  <Col md={3} className="p-2 px-md-3">
                    fileRegdate
                  </Col>
                  <Col md={3} className="p-2 px-md-3">
                    fileMaker
                  </Col>
                </Row>
              </Col>
            </Row>
            {products.map(product => (
              <Filelist {...product} key={product.fileNo} />
            ))}
          </Fragment>
        ) : (
          <p className="p-card mb-0 bg-light">0 items in your File list. Go ahead and add something!</p>
        )}
      </CardBody>
    </Card>
  );
};

export default FavouriteItems;
