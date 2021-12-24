import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Button, Form, FormGroup, Input, Label, Spinner } from 'reactstrap';
import withRedirect from '../../hoc/withRedirect';
import '../../assets/scss/FormBox.scss';

const RegistrationForm = ({ setRedirect, setRedirectUrl, layout, hasLabel }) => {

  // State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);

  const [showProgress, setShowProgress] = useState(true);
  // 오류 메세지 출력을 위한 상태값
  const [nameMessage, setNameMessage] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')

  // 유효성 검사를 위한 상태저장
  const [isName, setIsName] = useState(false)
  const [isEmail, setIsEmail] = useState(false)
  const [isPassword, setIsPassword] = useState(false)

  const onChangeEmail = e => {
    setEmail(e.target.value);
    const emails = /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (emails.test(email)) {
      setEmailMessage('올바른 이메일 형식입니다')
      setIsEmail(true)
    } else {
      setEmailMessage('이메일 형식이 올바르지 않습니다')
      setIsEmail(false)
    }
  };

  const onChangeName = e => {
    setName(e.target.value);
    if (name.length < 2) {
      setNameMessage('2글자 이상 입력해주세요')
      setIsName(false)
    } else {
      setNameMessage('올바른 이름 형식입니다')
      setIsName(true)
    }
  };
  const onChangePaswword = e => {
    setPassword(e.target.value);
    setIsPassword(true);
    const passwords = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/
    if (!passwords.test(password)) {
      setPasswordMessage('특수문자, 문자, 숫자를 포함한 8~15 자리 이상이여야 합니다');
      setIsPassword(false);
    } else {
      setPasswordMessage("안정한 비밀번호 입니다");
      setIsPassword(true)
    }

  };

  // Handler
  const handleSubmit = async e => {
    //새로고침 방지를 위함

    e.preventDefault();
    
    setIsDisabled(true)
    setShowProgress(false)
    toast.success(`${email}로 이메일을 보내는 중입니다...시간이 걸릴수있습니다`);


    const json = {
      userEmail: email,
      userPassword: password,
      userName: name
    }

    try {
      const response = await fetch(`/haru/user/join`, {
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
      setShowProgress(true)
    } catch (err) {
      setIsDisabled(false)
      setShowProgress(true)
      console.log(err);
    }

    setRedirect(true);

  }

  const findEmail = async () => {
    const emails = { userEmail: email }

    try {
      const response = await fetch(`/haru/user/checkemail`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(emails)
      })

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`)
      }

      const json = await response.json();

      if (json.result !== 'success') {
        throw json.message;
      }

      if (json.data) {
        setEmailMessage("이미 가입된 이메일 입니다.")
        setIsEmail(false)
      } else {
        setEmailMessage("가입이 가능한 이메일 입니다")
      }



    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (isEmail) {
      findEmail();
    }
  }, [isEmail])

  useEffect(() => {
    setRedirectUrl(`/authentication/basic/confirm-mail`);
  }, [setRedirectUrl, layout]);

  useEffect(() => {
    setIsDisabled(!isName || !isEmail || !isPassword);
  }, [isName, isEmail, isPassword]);

  return (
    <Form >
      {/* 이메일 입력 */}
      <FormGroup>
        {hasLabel && <Label>Email address</Label>}
        <Input
          placeholder={!hasLabel ? 'Email address' : ''}
          value={email}
          onChange={onChangeEmail}
        />
        {email.length > 0 && <span className={`message ${isEmail ? 'success' : 'error'}`}>{emailMessage}</span>}
      </FormGroup>
      {/* 이름입력 */}
      <FormGroup>
        {hasLabel && <Label>Name</Label>}
        <Input placeholder={!hasLabel ? 'Name' : ''} value={name} onChange={onChangeName} />
        {name.length > 0 && (<span className={`message ${isName ? 'success' : 'error'}`}>{nameMessage}</span>)}
      </FormGroup>
      {/* 비밀번호 입력 */}
      <div>
        <FormGroup>
          {hasLabel && <Label>Password</Label>}
          <Input
            placeholder={!hasLabel ? 'Password' : ''}
            value={password}
            onChange={onChangePaswword}
            type="password"
          />
          {password.length > 0 && (<span className={`message ${isPassword ? 'success' : 'error'}`}>{passwordMessage}</span>)}
        </FormGroup>
      </div>
      <FormGroup>

        <Button color="primary" block className="mt-3" disabled={isDisabled} onClick={handleSubmit}>
          다음
        </Button>
      </FormGroup>
      <Spinner hidden={showProgress} color="info" />
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