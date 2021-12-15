import React from 'react';
import ForgetPasswordForm from '../ForgetPasswordForm';

const ForgetPassword = () => {
  return (
    <div className="text-center">
      <h5 className="mb-0"> 비밀번호가 기억나지 않나요?</h5>
      <small>회원가입시 입력했던 이메일을 입력해 주세요. <br/> 해당 이메일로 임시비밀번호가 전송됩니다.</small>
      <ForgetPasswordForm />
    </div>
  );
};

export default ForgetPassword;
