import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import withRedirect from '../../hoc/withRedirect';
import { localIp } from '../../config';

const ForgetPasswordForm = ({ setRedirect, setRedirectUrl, layout }) => {
  // State
  const [email, setEmail] = useState('');
  const [sendCheck, setSendCheck] = useState(false);
  const [isfailCheck, setIsfailCheck] = useState(false);
  // Handler
  // 이메일 보내는곳
  const handleSubmit = async e => {
    e.preventDefault();
    console.log(email);
    setSendCheck(true);

    try {
      const response = await fetch(`haru/user/findPassword`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: email
      })

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`)
      }

      // const json = await response.json();
      // console.log(json);
      if (response.result !== 'success') {
        setIsfailCheck(true);
        throw response.message;
      } else {
        setIsfailCheck(false);
      }
      
      
    } catch (err) {
      console.log(err);
    }
    
    setRedirect(true);


    //toast.success(`An email is sent to ${email} with password reset link`);

  };

  useEffect(() => {
    setRedirectUrl(`/authentication/${layout}/confirm-mail`);
  }, [setRedirectUrl, layout]);

  return (
    <Form className="mt-4" onSubmit={handleSubmit}>
      <FormGroup>
        <Input
          className="form-control"
          placeholder="Email address"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          type="email"
        />
      </FormGroup>
      <div>
        {sendCheck ? '이메일 보내는중... 시간이 걸릴수 있습니다' : ' '}
      </div>
      <div>
        {isfailCheck ? '존제하지 않는 이메일 입니다' : ''}
      </div>
      <FormGroup>
        <Button color="primary" block disabled={!email}>
          Send reset link
        </Button>
      </FormGroup>
      <Link className="fs--1 text-600" to={`/authentication/${layout}/login`}>
        로그인 페이지로 돌아가기
        <span className="d-inline-block ml-1">&rarr;</span>
      </Link>
    </Form>
  );
};

ForgetPasswordForm.propTypes = {
  setRedirect: PropTypes.func.isRequired,
  setRedirectUrl: PropTypes.func.isRequired,
  layout: PropTypes.string
};

ForgetPasswordForm.defaultProps = { layout: 'basic' };

export default withRedirect(ForgetPasswordForm);
