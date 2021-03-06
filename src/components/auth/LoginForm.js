import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Form, Row, Col, FormGroup, Input, CustomInput, Label } from 'reactstrap';
import withRedirect from '../../hoc/withRedirect';
import { localIp } from '../../config';
import { ProfileContext } from '../../context/Context';

const LoginForm = ({ setRedirect, hasLabel, layout }) => {
  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isfailCheck, setIsfailCheck] = useState(false);
  const {ProfilePhoto, setProfilePhoto} = useContext(ProfileContext);

  // 로그인
  const handleSubmit = async e => {
    e.preventDefault();

    console.log(email, password);
    console.log(localIp);

    var params = 'userEmail=' + email + '&userPassword=' + password;

    try {
      const response = await fetch(`/haru/api/login`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json'
        },
        body: params
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const json = await response.json();

      if (json.result !== 'success') {
        setIsfailCheck(true);
        throw json.message;
      } else {
        sessionStorage.setItem('authUserEmail', json.data.userEmail);
        sessionStorage.setItem('authUserName', json.data.userName);
        sessionStorage.setItem('authUserNo', json.data.userNo);
        sessionStorage.setItem('authUserPhoto', json.data.userPhoto);
        setProfilePhoto(json.data.userPhoto);
        toast.success(`Logged in as ${email}`);
        setRedirect(true);
      }
    } catch (err) {
      console.error(err);
    }
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
      <div>{isfailCheck ? '로그인에 실패 하였습니다' : ''}</div>
      <Row className="justify-content-between align-items-center">
        {/* <Col xs="auto">
          <CustomInput
            id="customCheckRemember"
            label="아이디기억하기"
            checked={remember}
            onChange={({ target }) => setRemember(target.checked)}
            type="checkbox"
          />
        </Col> */}
        <Col xs="auto">
          <Link className="fs--1" to={`/authentication/${layout}/forget-password`}>
            비밀번호가 기억나지 않나요?
          </Link>
        </Col>
      </Row>
      <FormGroup>
        <Button color="primary" block className="mt-3">
          로그인
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
