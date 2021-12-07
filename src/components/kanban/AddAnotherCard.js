import React, { useContext, useState } from 'react';
import { KanbanContext } from '../../context/Context';
import { Button, Form, Input, Row, Col } from 'reactstrap';
import { localIp } from '../../config';

const AddAnotherCard = ({ kanbanColumnItem, setShowForm }) => {
  const { kanbanColumnsDispatch, kanbanTaskCards, kanbanTaskCardsDispatch } = useContext(KanbanContext);

  const [cardHeaderTitle, setCardHeaderTitle] = useState('');

  const handleAddCard = async value => {
//TODO 조진석 => 더미 데이터
    const json = {
      taskName: value,
      taskContents: value,
      taskListNo: kanbanColumnItem.taskListNo,
      taskOrder: kanbanColumnItem.taskVoList.length,
      taskWriter: '조진석'
    }

    const response = await fetch(`${localIp}/api/task/add`, {
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
      taskWriter: '조진석'
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
      id: kanbanColumnItem.taskListOrder
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    handleAddCard(cardHeaderTitle);
    setShowForm(false);
    setCardHeaderTitle('');
  };
  return (
    <div className="p-3 border bg-white rounded-soft transition-none mt-3">
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
