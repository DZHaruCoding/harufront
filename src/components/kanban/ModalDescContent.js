import _ from 'lodash';
import React, { useContext, useState } from 'react';
import { Button, Col, Form, Input, Row } from 'reactstrap';
import AppContext, { KanbanContext } from '../../context/Context';
import ButtonIcon from '../common/ButtonIcon';

const ModalDescContent = () => {
  const { kanbanColumns, kanbanColumnsDispatch } = useContext(KanbanContext);
  const [showForm, setShowForm] = useState(false);
  const { modalContent, setModalContent } = useContext(KanbanContext);
  const [columnContent, setColumnContent] = useState('');
  const { projectNo, projectTitle } = useContext(AppContext);
  const API_URL = 'http://localhost:8080/haru';

  const handleAddColumn = async value => {
    console.log('수정할 내용', value);
    // console.log('수정 전 내용', modalContent.taskCard.taskContents);

    let data = _.cloneDeep(modalContent);

    data.taskCard.taskContents = value;
    const taskNo = data.taskCard.taskNo;
    const taskData = { taskContents: value, taskNo: taskNo };
    const updateContents = async () => {
      const response = await fetch(`/haru/api/tasksetting/task/update`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(taskData)
      });
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const jsonResult = await response.json();

      if (jsonResult.result != 'success') {
        throw new Error(`${jsonResult.result} ${jsonResult.message}`);
      }
    };
    updateContents();
    setModalContent(data);

    const taskData2 = data.taskCard;
    const id = data.taskCard.taskNo;
    setModalContent(data);

    kanbanColumnsDispatch({
      type: 'TASKDESC',
      payload: taskData2,
      id: id
    });
    // console.log('수정 후 내용', data.taskCard.taskContents);

    // try {
    //   const json = {
    //     projectNo: projectNo,
    //     taskListName: value,
    //     taskListOrder: kanbanColumns.length + 1,
    //     projectName: projectTitle
    //   };

    //   const response = await fetch(`/haru/api/tasklist/add`, {
    //     method: 'post',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Accept: 'application/json'
    //     },
    //     body: JSON.stringify(json)
    //   });

    //   if (!response.ok) {
    //     throw new Error(`${response.status} ${response.statusText}`);
    //   }

    //   const jsonResult = await response.json();

    //   if (jsonResult.result != 'success') {
    //     throw new Error(`${jsonResult.result} ${jsonResult.message}`);
    //   }

    //   const nextKanbanColumnNum = jsonResult;

    //   kanbanColumnsDispatch({
    //     type: 'ADD',
    //     payload: {
    //       taskListNo: nextKanbanColumnNum.data,
    //       taskListOrder: kanbanColumns.length + 1,
    //       taskListName: value,
    //       taskVoList: []
    //     },
    //     id: kanbanColumns.length + 1
    //   });
    // } catch (err) {
    //   console.error(err);
    // }
  };

  const handleSubmit = e => {
    e.preventDefault();
    handleAddColumn(columnContent);
    setShowForm(false);
    setColumnContent('');

    // const response = fetch(`${localIp}/}`)
  };

  return (
    <div className="kanban-column mr-3">
      {showForm ? (
        <div className="bg-100 p-card rounded-soft transition-none">
          <Form onSubmit={e => handleSubmit(e)}>
            <Input
              type="textarea"
              placeholder="Enter list title..."
              className="mb-2 add-list"
              value={columnContent}
              autoFocus
              onChange={({ target }) => {
                setColumnContent(target.value);
              }}
            />
            <Row form>
              <Col>
                <Button color="primary" size="sm" block type="submit">
                  수정하기
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
                    setColumnContent('');
                  }}
                >
                  취소하기
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
          테스크 내용 수정하기
        </ButtonIcon>
      )}
    </div>
  );
};

export default ModalDescContent;
