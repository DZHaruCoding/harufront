import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Form, Row, Col, FormGroup, Input, CustomInput, Label } from 'reactstrap';
// import Divider from '../common/Divider';
// import SocialAuthButtons from './SocialAuthButtons';
import withRedirect from '../../hoc/withRedirect';

const LoginForm = ({ setRedirect, hasLabel, layout }) => {
  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);

  // Handler
  const handleSubmit = async e => {
    e.preventDefault();
    
    console.log(email, password)

    try{
      const response = await fetch(`/api/login`, {
          method: 'post',
          headers: {
              'Content-Type' : 'application/x-www-form-urlencoded',
              'Accept' : 'application/json'
          },
          body:` ?userEmail=${email}&userPassword=${password}`

      })

      console.log("응답을 바람니다"+response);

      if(!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`)
      }

      const json = await response.json();
      
      if(json.result !== 'success'){
          throw json.message;
      }
  
  } catch(err) {
      console.error(err);
  }

    e.preventDefault();
    toast.success(`Logged in as ${email}`);
    setRedirect(true);
  };

  useEffect(() => {
    setIsDisabled(!email || !password);
  }, [email, password]);

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        {hasLabel && <Label>Email address</Label>}
        <Input
          placeholder={!hasLabel ? 'Email address' : ''}
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          type="email"
        />
      </FormGroup>
      <FormGroup>
        {hasLabel && <Label>Password</Label>}
        <Input
          placeholder={!hasLabel ? 'Password' : ''}
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          type="password"
        />
      </FormGroup>
      <Row className="justify-content-between align-items-center">
        <Col xs="auto">
          <CustomInput
            id="customCheckRemember"
            label="Remember me"
            checked={remember}
            onChange={({ target }) => setRemember(target.checked)}
            type="checkbox"
          />
        </Col>
        <Col xs="auto">
          <Link className="fs--1" to={`/authentication/${layout}/forget-password`}>
            Forget Password?
          </Link>
        </Col>
      </Row>
      <FormGroup>
        <Button color="primary" block className="mt-3" disabled={isDisabled}>
          Log in
        </Button>
      </FormGroup>
      {/* <Divider className="mt-4">or log in with</Divider>
      <SocialAuthButtons /> */}
    </Form>
  );
};

LoginForm.propTypes = {
  setRedirect: PropTypes.func.isRequired,
  layout: PropTypes.string,
  hasLabel: PropTypes.bool
};

LoginForm.defaultProps = {
  layout: 'basic',
  hasLabel: false
};

export default withRedirect(LoginForm);
