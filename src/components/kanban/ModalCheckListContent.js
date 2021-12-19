import React, { useContext, useState } from 'react';
import { Button, Media } from 'reactstrap';
import { Link } from 'react-router-dom';
import update from 'react-addons-update';
import { KanbanContext } from '../../context/Context';
import _ from 'lodash';
import { Alert, Collapse, FormControl, InputGroup, ToggleButton } from 'react-bootstrap';
import Flex from '../common/Flex';
const ModalCheckListContent = () => {
  const { modalContent, setModalContent } = useContext(KanbanContext);
  const { checkListInfo } = modalContent;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState('');
  //   checklistContents: "task1의 업무0"
  // checklistNo: 1
  // checklistState: "do"
  // taskNo: 1

  function doneCheckList(check) {
    let data = _.cloneDeep(modalContent);
    const index = _.findIndex(data.checkListInfo, { checklistNo: check.checklistNo });
    let newCheckList = {
      checklistNo: check.checklistNo,
      checklistContents: check.checklistContents,
      checklistState: check.checklistState === 'done' ? 'do' : 'done',
      taskNo: check.taskNo
    };
    data.checkListInfo.splice(index, 1, newCheckList);
    setModalContent(data);
    // data.checkListInfo.checklistState == 'done';

    // data.checkListInfo.checklistState == 'do';
  }

  function delCheckList(check) {
    let data = _.cloneDeep(modalContent);
    const index = _.findIndex(data.checkListInfo, { checklistNo: check.checklistNo });
    let newCheckList = {
      checklistNo: check.checklistNo,
      checklistContents: check.checklistContents,
      checklistState: check.checklistState === 'del' ? 'del' : 'del',
      taskNo: check.taskNo
    };
    data.checkListInfo.splice(index, 1, newCheckList);
    setModalContent(data);
  }

  function insertChecklist() {
    //
    const taskNo = modalContent.taskCard.taskNo;
    const checklistContents = form;

    const NewTodo = { taskNo, checklistContents };
    let data = _.cloneDeep(modalContent);
    data.checkListInfo = [NewTodo, ...data.checkListInfo];
    setModalContent(data);
    setForm('');
    setOpen(false);
  }

  return (
    <>
      {checkListInfo &&
        checkListInfo.map((check, index) => {
          return check.checklistState !== 'del' ? (
            <Media size="sm" className="mb-3" key={index}>
              <ToggleButton
                type="checkbox"
                className="doneCheck"
                onClick={() => doneCheckList(check)}
                checked={check.checklistState === 'done'}
                size="sm"
                readOnly
              >
                Checked
              </ToggleButton>
              <Media size="sm" body className="ml-2 fs--1 ">
                {check.checklistState === 'done' ? (
                  <Alert size="sm" variant="primary">
                    <del>&nbsp;{check.checklistContents}</del>
                  </Alert>
                ) : (
                  <Alert size="sm" variant="primary">
                    &nbsp;{check.checklistContents}
                  </Alert>
                )}
                <Button variant="secondary" size="sm" onClick={() => delCheckList(check)}>
                  할 일 삭제
                </Button>
              </Media>
            </Media>
          ) : (
            ''
          );
        })}
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
        variant="falcon-secondary"
        className="mb-2 float-end bg-black border"
        sm={{
          offset: 1,
          size: 'auto'
        }}
      >
        할 일 추가
      </Button>
      <Collapse in={open}>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="할 일을 추가해 주세요."
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            onChange={e => setForm(e.target.value)}
            value={form}
          />
          <Button variant="outline-secondary" id="button-addon2" onClick={() => insertChecklist()}>
            추가
          </Button>
        </InputGroup>
      </Collapse>
    </>
  );
};
export default ModalCheckListContent;
