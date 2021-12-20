import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Form, FormGroup, Input, Spinner } from 'reactstrap';
import withRedirect from '../../hoc/withRedirect';

const ForgetPasswordForm = ({ setRedirect, setRedirectUrl, layout }) => {
  // State
  const [email, setEmail] = useState('');
  const [sendCheck, setSendCheck] = useState(false);
  const [isfailCheck, setIsfailCheck] = useState(false);
  const [showProgress, setShowProgress] = useState(true);
  // Handler
  // 이메일 보내는곳
  const handleSubmit = async e => {
    e.preventDefault();
    console.log(email);
    setSendCheck(false);
    setShowProgress(false)
    try {
      const response = await fetch("/haru/user/findPassword", {
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

      const json = await response.json();
      console.log(json);
      if (json.data == false) {
        setIsfailCheck(true);
        throw json.message;
      } else {
        setIsfailCheck(false);
      }
      
      
    } catch (err) {
      console.log(err);
    }
    
    setRedirect(true);


    toast.success(`${email}로 이메일을 보내는 중이니다...시간이 걸릴수있습니다.`);

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
          이메일 전송
        </Button>
        <Spinner hidden={showProgress} color="info" />
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
