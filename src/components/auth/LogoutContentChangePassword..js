import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import rocket from '../../assets/img/illustrations/rocket.png';

const LogoutContent = ({ layout, titleTag: TitleTag }) => {
  return (
    <Fragment>
      <img className="d-block mx-auto mb-4" src={rocket} alt="shield" width={70} />
      <TitleTag>로그아웃 되었습니다!!</TitleTag>
      <p>
        HARU 프로젝트를 이용해주셔서 감사합니다 <br className="d-none d-sm-block" />
        변경한 비밀번호로 다시 로그인해 주시기 바랍니다.
      </p>
      <Button tag={Link} color="primary" size="sm" className="mt-3" to={``}>
        <FontAwesomeIcon icon="chevron-left" transform="shrink-4 down-1" className="mr-1" />
        로그인 하러가기
      </Button>
    </Fragment>
  );
};

LogoutContent.propTypes = {
  layout: PropTypes.string,
  titleTag: PropTypes.string
};

LogoutContent.defaultProps = {
  layout: 'basic',
  titleTag: 'h4'
};

export default LogoutContent;
