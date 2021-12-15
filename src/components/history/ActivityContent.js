import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import createMarkup from '../../helpers/createMarkup';

const ActivityContent = ({ to, avatar, logDate, className, unread, flush, emoji, logContents }) => (
  <Link className={classNames('notification', { 'bg-200': unread, 'notification-flush': flush }, className)} to={'#'}>
    {avatar && (
      <div className="notification-avatar">
        <Avatar {...avatar} className="mr-3" />
      </div>
    )}
    <div className="notification-body">
      <p className={emoji ? 'mb-1' : 'mb-0'} dangerouslySetInnerHTML={createMarkup(logContents)} />
      <span className="notification-time">
        {emoji && (
          <span className="mr-1" role="img" aria-label="Emoji">
            {emoji}
          </span>
        )}
        {logDate}
      </span>
    </div>
  </Link>
);

ActivityContent.propTypes = {
  to: PropTypes.string.isRequired,
  avatar: PropTypes.shape(Avatar.propTypes),
  logDate: PropTypes.string.isRequired,
  className: PropTypes.string,
  unread: PropTypes.bool,
  flush: PropTypes.bool,
  emoji: PropTypes.string,
  logContents: PropTypes.node
};

ActivityContent.defaultProps = { unread: false, flush: false };

export default ActivityContent;
