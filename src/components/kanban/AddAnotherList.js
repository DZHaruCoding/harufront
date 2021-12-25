import React, { useContext, useState } from 'react';
import AppContext, { KanbanContext } from '../../context/Context';
import { Button, Form, Input, Row, Col } from 'reactstrap';
import ButtonIcon from '../common/ButtonIcon';
import {API_URL, GCP_API_URL, localIp} from '../../config';
import SockJsClient from 'react-stomp';

const AddAnotherList = () => {
  const { kanbanColumns, kanbanColumnsDispatch } = useContext(KanbanContext);

  const [showForm, setShowForm] = useState(false);
  const [columnHeaderTitle, setColumnHeaderTitle] = useState('');
  const {projectNo, projectTitle} = useContext(AppContext);
  const { loading, notifications, setNotifications } = useContext(AppContext);
  let clientRef = null;

  const handleAddColumn = async value => {

    console.log("asdadasdsa",window.sessionStorage.getItem("authUserNo"));
    try {
      const json = {
        projectNo : projectNo,
        taskListName: value,
        taskListOrder: kanbanColumns.length + 1,
        projectName: projectTitle
      }
  
      const response = await fetch(`/haru/api/tasklist/add`, {
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
  
      const nextKanbanColumnNum = jsonResult;
  
      kanbanColumnsDispatch({
        type: 'ADD',
        payload: {taskListNo: nextKanbanColumnNum.data, taskListOrder: kanbanColumns.length + 1, taskListName: value, taskVoList: [] },
        id: kanbanColumns.length + 1
      });
    } catch(err) {
      console.error(err);
    }

  };

  const socketCallback = (socketData) => {
    console.log("zzzz",socketData);
    kanbanColumnsDispatch({
      type: 'ADD',
      payload: {taskListNo: socketData.taskListNo, taskListOrder: kanbanColumns.length + 1, taskListName: socketData.data.taskListName, taskVoList: [] },
      id: kanbanColumns.length + 1
    });

    // const json = {
    //   noticeNo: socketData.bellNo,
    //   noticeMessage: socketData.bell
    // }
    // setNotifications([...notifications, json])
  }



  const handleSubmit = e => {
    e.preventDefault();
    handleAddColumn(columnHeaderTitle);
    setShowForm(false);
    setColumnHeaderTitle('');

    // const response = fetch(`${localIp}/}`)
  };

  return (
    <div className="kanban-column mr-3">
      <SockJsClient
          url={`${GCP_API_URL}/haru/socket`}
          topics={[`/topic/kanban/tasklist/add/${window.sessionStorage.getItem("authUserNo")}/${projectNo}`]}
          onMessage={socketData => {socketCallback(socketData)}}
          ref={(client) => {
            clientRef = client
          }}
      />
      {showForm ? (
        <div className="bg-100 p-card rounded-soft transition-none">
          <Form onSubmit={e => handleSubmit(e)}>
            <Input
              type="textarea"
              placeholder="Enter list title..."
              className="mb-2 add-list"
              value={columnHeaderTitle}
              autoFocus
              onChange={({ target }) => {
                setColumnHeaderTitle(target.value);
              }}
            />
            <Row form>
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
                    setColumnHeaderTitle('');
                  }}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      ) : (
        <ButtonIcon
          className="bg-400 border-400"
          color="secondary"
          block
          icon="plus"
          iconClassName="mr-1"
          onClick={() => {
            setShowForm(true);
          }}
        >
          Add another list
        </ButtonIcon>
      )}
    </div>
  );
};

export default AddAnotherList;
