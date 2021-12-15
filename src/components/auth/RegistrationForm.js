import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, CustomInput, Form, FormGroup, Input, Label } from 'reactstrap';
import Divider from '../common/Divider';
import SocialAuthButtons from './SocialAuthButtons';
import withRedirect from '../../hoc/withRedirect';
import ForgetPassword from './split/ForgetPassword';
import {localIp} from '../../config';

const RegistrationForm = ({ setRedirect, setRedirectUrl, layout, hasLabel }) => {
  // State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');
  // const [isAccepted, setIsAccepted] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  // Handler
  const handleSubmit = async e => {
    e.preventDefault();

    const json = {
      userEmail: email,
      userPassword: password,
      userName: name
    }

    try {
      const response = await fetch(`${localIp}/api/user/join`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(json)
      })

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`)
      }

      if (response.result !== 'success') {
        throw json.message;
      }
    } catch (err) {
      console.log(err);
    }

    toast.success(`해당 이메일로 인증 메일이 발송되었습니다 ${email}`);
    setRedirect(true);
  };

  useEffect(() => {
    setRedirectUrl(`/authentication/${layout}/login`);
  }, [setRedirectUrl, layout]);

  useEffect(() => {
    setIsDisabled(!name || !email || !password);
  }, [name, email, password]);

  return (
    <Form onSubmit={handleSubmit}>
      {/* 이메일 입력 */}
      <FormGroup>
        {hasLabel && <Label>Email address</Label>}
        <Input
          placeholder={!hasLabel ? 'Email address' : ''}
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          type="email"
        />
      </FormGroup>
      {/* 이름입력 */}
      <FormGroup>
        {hasLabel && <Label>Name</Label>}
        <Input placeholder={!hasLabel ? 'Name' : ''} value={name} onChange={({ target }) => setName(target.value)} />
      </FormGroup>

      {/* 비밀번호 입력 */}
      <div>
        <FormGroup>
          {hasLabel && <Label>Password</Label>}
          <Input
            placeholder={!hasLabel ? 'Password' : ''}
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            type="password"
          />
        </FormGroup>
      </div>
      <FormGroup>

        {/* <Button tag={Link} to="/authentication/basic/forget-password" color="primary" block className="mt-3">
          다음
        </Button> */}
        <Button color="primary" block className="mt-3">
           다음
        </Button>
      </FormGroup>
      {/* //<Divider className="mt-4">or register with</Divider> */}
      {/* <SocialAuthButtons /> */}
    </Form>
  );
};

RegistrationForm.propTypes = {
  setRedirect: PropTypes.func.isRequired,
  setRedirectUrl: PropTypes.func.isRequired,
  layout: PropTypes.string,
  hasLabel: PropTypes.bool
};

RegistrationForm.defaultProps = {
  layout: 'basic',
  hasLabel: false
};

export default withRedirect(RegistrationForm);