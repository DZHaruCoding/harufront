import React, { useContext, useEffect } from 'react';
import { Media, Form, Input, Button } from 'reactstrap';
import Avatar from '../common/Avatar';
import users from '../../data/dashboard/users';
import Flex from '../common/Flex';
import { Link } from 'react-router-dom';
import { KanbanContext } from '../../context/Context';
import _ from 'lodash';

const ModalCommentContent = () => {
  const { modalContent, setModalContent } = useContext(KanbanContext);
  console.log('코멘트 시작', modalContent);
  console.log('코멘트 시작', modalContent.commentsInfo);
  function updataComment(val) {
    let data = _.cloneDeep(modalContent);
    data.commentsInfo = [val, ...data.commentsInfo];
    setModalContent(data);
  }

  return (
    <>
      <Media>
        <Media body className="fs--1">
          <div className="position-relative border rounded mb-3">
            <Form
              onSubmit={e => {
                e.preventDefault();
                updataComment(e.target.comments.value);
              }}
            >
              <Input name="comments" type="textarea" className="border-0 rounded-bottom-0 resize-none" rows={3} />
              <Flex justify="between" align="center" className="bg-light rounded-bottom p-2 mt-1">
                <Button size="sm" color="primary" type="submit">
                  Save
                </Button>
              </Flex>
            </Form>
          </div>
        </Media>
      </Media>
      {modalContent.commentsInfo &&
        modalContent.commentsInfo.map((comment, index) => {
          return (
            <Media className="mb-3">
              <Link to="pages/profile">
                <Avatar src={users[3].avatar.src} size="l" />
              </Link>
              <Media body className="ml-2 fs--1">
                <p className="mb-1 bg-200 rounded-soft p-2">
                  <Link to="pages/profile" className="font-weight-semi-bold">
                    {comment.userName}
                  </Link>
                  {comment.commentContents}
                </p>
              </Media>
            </Media>
          );
        })}
    </>
  );
};

export default ModalCommentContent;
