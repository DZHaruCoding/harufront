import React, { useContext, useRef, useState } from 'react';
import AppContext, { KanbanContext } from '../../context/Context';
import { Button, Form, Input, Row, Col } from 'reactstrap';
import { API_URL, GCP_API_URL, localIp } from '../../config';
import SockJsClient from 'react-stomp';

const AddAnotherCard = ({ kanbanColumnItem, setShowForm, websocket }) => {
  const {
    kanbanColumnsDispatch,
    kanbanTaskCards,
    kanbanTaskCardsDispatch,
    $websocket,
    fetchInsertHistory
  } = useContext(KanbanContext);

  const [cardHeaderTitle, setCardHeaderTitle] = useState('');
  let $webSocket2 = useRef(null);

  const { projectNo, projectTitle, members } = useContext(AppContext);

  const handleAddCard = async value => {
    const json = {
      taskName: value,
      taskContents: value,
      taskListNo: kanbanColumnItem.taskListNo,
      taskOrder: kanbanColumnItem.taskVoList.length,
      taskWriter: window.sessionStorage.getItem('authUserName')
    };

    const response = await fetch(`/haru/api/task/add`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(json)
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const jsonResult = await response.json();

    if (jsonResult.result != 'success') {
      throw new Error(`${jsonResult.result} ${jsonResult.message}`);
    }

    const taskVoList = {
      taskNo: jsonResult.data,
      taskName: value,
      taskContents: value,
      taskListNo: kanbanColumnItem.taskListNo,
      taskOrder: kanbanColumnItem.taskVoList.length,
      taskWriter: window.sessionStorage.getItem('authUserName'),
      taskLabel: '#777777',
      taskVoList
    };

    kanbanTaskCardsDispatch({
      type: 'ADD',
      payload: taskVoList,
      id: taskVoList.taskNo,
      isCard: true
    });

    kanbanColumnsDispatch({
      type: 'EDIT',
      payload: { ...kanbanColumnItem, taskVoList: [...kanbanColumnItem.taskVoList, taskVoList] },
      id: kanbanColumnItem.taskListNo
    });

    const kanbanboardSocketData = {
      taskVoList: taskVoList,
      kanbanColumnItem: kanbanColumnItem,
      projectNo: projectNo,
      projectTitle: projectTitle,
      userNo: window.sessionStorage.getItem('authUserNo'),
      userName: window.sessionStorage.getItem('authUserName')
    };

    $webSocket2.current.sendMessage('/app/task/add', JSON.stringify(kanbanboardSocketData));

    const clientRef = $websocket;
    fetchInsertHistory(
      window.sessionStorage.getItem('authUserNo'),
      window.sessionStorage.getItem('authUserName'),
      members,
      'taskInsert',
      value,
      projectNo,
      clientRef
    );
  };

  const socketCallback = e => {
    console.log('sdsas' + e);
  };

  const handleSubmit = e => {
    e.preventDefault();
    handleAddCard(cardHeaderTitle);
    setShowForm(true);
    setCardHeaderTitle('');
  };
  // 조진석 테스트
  return (
    <div className="p-3 border bg-white rounded-soft transition-none mt-3">
      <SockJsClient
        url={`${GCP_API_URL}/haru/socket`}
        topics={[`/topic/kanban/task/add/${window.sessionStorage.getItem('authUserNo')}/${projectNo}`]}
        onMessage={socketData => {
          socketCallback(socketData);
        }}
        ref={$webSocket2}
      />

      <Form onSubmit={e => handleSubmit(e)}>
        <Input
          type="textarea"
          placeholder="Enter a title for this card..."
          className="mb-2 add-card"
          value={cardHeaderTitle}
          autoFocus
          onChange={({ target }) => {
            setCardHeaderTitle(target.value);
          }}
        />
        <Row form className="mt-2">
          <Col>
            <Button color="primary" size="sm" block type="submit">
              Add
            </Button>
          </Col>
          <Col>
            <Button
              color="outline-secondary"
              size="sm"
              block
              className="border-400"
              onClick={() => {
                setShowForm(false);
                setCardHeaderTitle('');
              }}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AddAnotherCard;
