import _ from 'lodash';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Input, Media } from 'reactstrap';
import { KanbanContext, ProfileContext } from '../../context/Context';
import DefaultImage from '../../assets/img/Default.png';
import Avatar from '../common/Avatar';
import Flex from '../common/Flex';
const API_URL = 'http://localhost:8080/haru';

const ModalCommentContent = ({ clientRef, members, fetchInsertHistory }) => {
  const { modalContent, setModalContent } = useContext(KanbanContext);
  const [form, setForm] = useState('');
  const { ProfilePhoto, setProfilePhoto } = useContext(ProfileContext);
  // window.
  function updataComment() {
    const taskNo = modalContent.taskCard.taskNo;
    const userNo = window.sessionStorage.getItem('authUserNo');
    const userName = window.sessionStorage.getItem('authUserName');
    const userPhoto = window.sessionStorage.getItem('authUserPhoto');
    const commentRegdate = 'Now';
    const commentContents = form;
    // commentContents: "이종윤이 Task1에 코멘트달았다"
    // commentNo: 1
    // commentRegdate: "2021년 11월 30일"
    // commentState: null
    // taskNo: 1
    // userEmail: "stpn94@gmail.com"
    // userName: "이종윤"
    // userNo: 1
    // userPhoto: "empty.jpg"

    const NewData2 = { taskNo, userNo, commentContents };
    console.log('코멘트 이미지 변경 확인!!!!!!!!!!!!!!!!!!!!!!!!!!', ProfilePhoto);

    const insertComment = async () => {
      const response = await fetch(`/haru/api/comment`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(NewData2)
      });
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const jsonResult = await response.json();
      const commentNo = jsonResult.data;
      const NewData = { taskNo, userNo, userName, commentContents, userPhoto, commentRegdate, commentNo };

      if (jsonResult.result != 'success') {
        throw new Error(`${jsonResult.result} ${jsonResult.message}`);
      }
      console.log(NewData);
      let data = _.cloneDeep(modalContent);
      data.commentsInfo = [NewData, ...data.commentsInfo];
      setModalContent(data);
    };
    insertComment();
  }

  function deleteComment(commentNo) {
    const delComment = async () => {
      const response = await fetch(`/haru/api/comment/${commentNo}`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const jsonResult = await response.json();

      if (jsonResult.result != 'success') {
        throw new Error(`${jsonResult.result} ${jsonResult.message}`);
      }
      let data = _.cloneDeep(modalContent);
      const filteredState = modalContent.commentsInfo.filter(item => item.commentNo !== commentNo);
      data.commentsInfo = filteredState;
      setModalContent(data);
    };

    delComment();
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
              <Link to="window.location.href">
                {comment.userPhoto == '/assets/upUserimages/Default.png' ? (
                  <Avatar src={`${DefaultImage}`} size="l" />
                ) : (
                  <Avatar src={`/haru${ProfilePhoto}`} size="l" />
                )}
              </Link>
              <Media body className="ml-2 fs--1">
                <p className="mb-1 bg-200 rounded-soft p-2">
                  <Link to="window.location.href" className="font-weight-semi-bold">
                    {comment.userName} :
                  </Link>
                  {comment.commentContents}
                </p>
                <Link
                  to="#!"
                  onClick={() => {
                    deleteComment(comment.commentNo);
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
