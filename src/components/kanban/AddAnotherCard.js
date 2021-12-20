import React, { useContext, useRef, useState } from 'react';
import AppContext, { KanbanContext } from '../../context/Context';
import { Button, Form, Input, Row, Col } from 'reactstrap';
import { localIp } from '../../config';
import SockJsClient from 'react-stomp';


const AddAnotherCard = ({ kanbanColumnItem, setShowForm, websocket }) => {
  const { kanbanColumnsDispatch, kanbanTaskCards, kanbanTaskCardsDispatch } = useContext(KanbanContext);

  const [cardHeaderTitle, setCardHeaderTitle] = useState('');


  const API_URL = 'http://localhost:8080/haru';
  let $webSocket = useRef(null);

  const { projectNo, projectTitle } = useContext(AppContext);

  const handleAddCard = async value => {
//TODO 조진석 => 더미 데이터
    const json = {
      taskName: value,
      taskContents: value,
      taskListNo: kanbanColumnItem.taskListNo,
      taskOrder: kanbanColumnItem.taskVoList.length,
      taskWriter: window.sessionStorage.getItem("authUserName")
    }

    const response = await fetch(`/haru/api/task/add`, {
      method: 'post',
      headers: {
        "Content-Type": 'application/json',
        'Accept': 'application/json'
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
      taskWriter: '조진석',
      taskLabel:'#777777',
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
      taskVoList : taskVoList,
      kanbanColumnItem : kanbanColumnItem,
      projectNo : projectNo,
      projectTitle : projectTitle,
      userNo : window.sessionStorage.getItem("authUserNo"),
      userName : window.sessionStorage.getItem("authUserName")
    }


    $webSocket.current.sendMessage("/app/task/add", JSON.stringify(kanbanboardSocketData));
  };

  const socketCallback = e => {
      console.log("sdsas" + e);
  }
  
  const handleSubmit = e => {
    e.preventDefault();
    handleAddCard(cardHeaderTitle);
    // setShowForm(true);
    setCardHeaderTitle('');
  };
  return (
    <div className="p-3 border bg-white rounded-soft transition-none mt-3">

    <SockJsClient
          url={`${API_URL}/socket`}
          topics={[`/topic/kanban/task/add/${window.sessionStorage.getItem("authUserNo")}`]}
          onMessage={socketData => {socketCallback(socketData)}}
          ref={$webSocket}
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
