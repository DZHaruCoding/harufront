import React, { Fragment } from 'react';
import { Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import RegistrationForm from '../RegistrationForm'

const Registration = () => (
  <Fragment>
    <Row className="text-left">
      <Col>
        <h5 id="modalLabel">회원가입</h5>
      </Col>
      <Col xs="auto">
        <p className="fs--1 text-600">
          계정이 있으신가요? <Link to="/authentication/basic/login">Login</Link>
        </p>
      </Col>
    </Row>
    <RegistrationForm />
  </Fragment>
);

export default Registration;
