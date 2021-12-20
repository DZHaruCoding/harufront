// 고차 컴포넌트(Higher-order Component 줄여서 HOC) 알아야 사용 가능
// 이 컴포넌트 쓰는사람은 밑의 링크 참고바람
// https://www.youtube.com/watch?v=rbfQsKqhwTw 고차 컴포넌트에 대한 강의 영상이니 꼭 한번 보길 바란다.

import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

const withRedirect = OriginalComponent => {
  const UpdatedComponent = props => {
    // State
    const [redirect, setRedirect] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState('/pages/events');

    if (redirect) {
      return <Redirect to={redirectUrl} />;
    }

    return <OriginalComponent setRedirect={setRedirect} setRedirectUrl={setRedirectUrl} {...props} />;
  };

  return UpdatedComponent;
};

export default withRedirect;
