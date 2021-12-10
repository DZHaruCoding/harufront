import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import createMarkup from '../../helpers/createMarkup';

const Notification = ({className, flush, noticeNo, noticeMessage, noticeDate, noticeLink, messageCk  }) => (
  <Link className={classNames('notification', { 'bg-200': messageCk , 'notification-flush': flush }, className)} to="#!">
    {/* {avatar && (
      <div className="notification-avatar">
        <Avatar {...avatar} className="mr-3" />
      </div>
    )} */}
    <div className="notification-body">
      <p className={'mb-1'}  >{noticeMessage} </p>
      <span className="notification-time">
        {/* {emoji && (
          <span className="mr-1" role="img" aria-label="Emoji">
            {emoji}
          </span>
        )} */}
        {noticeDate}
      </span>
    </div>
  </Link>
);

Notification.propTypes = {
  noticLink: PropTypes.string.isRequired,
  noticeDate: PropTypes.string.isRequired,
  className: PropTypes.string,
  messageCk: PropTypes.bool,
  flush: PropTypes.bool,
  noticeMessage: PropTypes.string
};

Notification.defaultProps = { messageCk: false, flush: false };

export default Notification;
