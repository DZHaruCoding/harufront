import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import envelope from '../../assets/img/illustrations/envelope.png';

const ConfirmMailContent = ({ email, layout, titleTag: TitleTag }) => (
  <Fragment>
    <img className="d-block mx-auto mb-4" src={envelope} alt="sent" width={70} />
    <TitleTag>이메일을 확인해 주세요!!</TitleTag>
    <p>
      입력하신 이메일로 인증 이메일이 발송되었습니다!<br /> 이메일을 확인해주세요.
    </p>
    <Button tag={Link} color="primary" size="sm" className="mt-3" to={`/authentication/${layout}/login`}>
      <FontAwesomeIcon icon="chevron-left" transform="shrink-4 down-1" className="mr-1" />
      Return to login
    </Button>
  </Fragment>
);

ConfirmMailContent.propTypes = {
  email: PropTypes.string.isRequired,
  layout: PropTypes.string,
  titleTag: PropTypes.string
};

ConfirmMailContent.defaultProps = { layout: 'basic', titleTag: 'h4' };

export default ConfirmMailContent;
