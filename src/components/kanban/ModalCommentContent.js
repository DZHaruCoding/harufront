import React, { useContext, useEffect, useState } from 'react';
import { Media, Form, Input, Button } from 'reactstrap';
import Avatar from '../common/Avatar';
import users from '../../data/dashboard/users';
import Flex from '../common/Flex';
import { Link } from 'react-router-dom';
import { KanbanContext } from '../../context/Context';
import team3 from '../../assets/img/team/3.jpg';
import _ from 'lodash';
import axios from 'axios';
import { Image } from 'react-bootstrap';
const API_URL = 'http://localhost:8080/haru';
const API_HEADERS = {
  'Context-Type': 'application/json'
};
const ModalCommentContent = () => {
  const { modalContent, setModalContent } = useContext(KanbanContext);
  const [form, setForm] = useState('');

  // window.
  function updataComment() {
    const taskNo = modalContent.taskCard.taskNo;
    const userNo = window.sessionStorage.getItem('authUserNo');
    const userName = window.sessionStorage.getItem('authUserName');
    const userPhoto = window.sessionStorage.getItem('authUserPhoto');
    console.log('userPhoto===', userPhoto);
    const commentRegdate = 'Now';
    const commentContents = form;
    //     commentContents: "이종윤이 Task1에 코멘트달았다"
    // commentNo: 1
    // commentRegdate: "2021년 11월 30일"
    // commentState: null
    // taskNo: 1
    // userEmail: "stpn94@gmail.com"
    // userName: "이종윤"
    // userNo: 1
    // userPhoto: "empty.jpg"

    const NewData = { taskNo, userNo, userName, commentContents, userPhoto, commentRegdate };
    console.log(NewData);
    let data = _.cloneDeep(modalContent);
    data.commentsInfo = [NewData, ...data.commentsInfo];
    setModalContent(data);
  }
  function deleteComment(commentNo) {
    axios.delete(`/api/comment/${commentNo}`).then(
      setModalContent({
        commentsInfo: _.filter(modalContent.commentsInfo, function(item) {
          return item.commentNo !== commentNo;
        })
      })
    );
    // .catch(console.error());
  }

  return (
    <>
      <Media>
        <Media body className="fs--1">
          <div className="position-relative border rounded mb-3">
            <Form
              onSubmit={e => {
                e.preventDefault();
                updataComment();
                setForm('');
              }}
            >
              <Input
                name="comments"
                type="textarea"
                value={form}
                onChange={e => setForm(e.target.value)}
                className="border-0 rounded-bottom-0 resize-none"
                rows={3}
              />
              <Flex justify="between" align="center" className="bg-light rounded-bottom p-2 mt-1">
                <Button size="sm" color="primary" type="submit">
                  저장하기
                </Button>
              </Flex>
            </Form>
          </div>
        </Media>
      </Media>
      {modalContent.commentsInfo &&
        modalContent.commentsInfo.map((comment, index) => {
          return (
            <Media className="mb-3" key={index}>
              <Link to="pages/profile">
                {comment.userPhoto == '/assets/img/Default.png' ? (
                  <Avatar src={`/assets/img/Default.png`} size="l" />
                ) : (
                  <Avatar src={`${API_URL}${comment.userPhoto}`} size="l" />
                )}
              </Link>
              <Media body className="ml-2 fs--1">
                <p className="mb-1 bg-200 rounded-soft p-2">
                  <Link to="pages/profile" className="font-weight-semi-bold">
                    {comment.userName} :
                  </Link>
                  {comment.commentContents}
                </p>
                <Link
                  to="#!"
                  onClick={() => {
                    deleteComment(comment.commentNo, index);
                  }}
                >
                  Remove
                </Link>
              </Media>
              <span> &bull;{comment.commentRegdate}</span>
            </Media>
          );
        })}
    </>
  );
};

export default ModalCommentContent;
