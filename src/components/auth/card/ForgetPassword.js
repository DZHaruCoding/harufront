import React from 'react';
import ForgetPasswordForm from '../ForgetPasswordForm';
import AuthCardLayout from '../../../layouts/AuthCardLayout';
import { Link } from 'react-router-dom';

const ForgetPassword = () => {
  return (
    <AuthCardLayout
      leftSideContent={
        <p className="mb-0 mt-4 mt-md-5 fs--1 font-weight-semi-bold text-300">
          Read our{' '}
          <Link className="text-underline text-300" to="#!">
            terms
          </Link>{' '}
          and{' '}
          <Link className="text-underline text-300" to="#!">
            conditions{' '}
          </Link>
        </p>
      }
    >
      <h4 className="mb-0"> 비밀번호가 기억나지 않나요?</h4>
      <p className="mb-0">회원가입시 입력했던 이메일 주소를 입력해주세요 임시 비밀번호가 전송됩니다.</p>
      <ForgetPasswordForm layout="card" />
    </AuthCardLayout>
  );
};

export default ForgetPassword;
