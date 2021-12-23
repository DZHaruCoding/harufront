import _ from 'lodash';
import React, { useContext, useState } from 'react';
import { Alert, Collapse, FormControl, InputGroup, ToggleButton } from 'react-bootstrap';
import { Button, Media } from 'reactstrap';
import AppContext, { KanbanContext } from '../../context/Context';

const API_URL = 'http://localhost:8080/haru';
const API_HEADERS = {
  'Context-Type': 'application/json'
};
const ModalCheckListContent = ({ clientRef, members, fetchInsertHistory }) => {
  const { modalContent, setModalContent, setHistory } = useContext(KanbanContext);
  const { checkListInfo } = modalContent;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState('');
  const { projectNo, activityLog, activityLogDispatch } = useContext(AppContext);

  //   checklistContents: "task1의 업무0"
  // checklistNo: 1
  // checklistState: "do"
  // taskNo: 1
  /////////////////////////////////////////////////////////////////////////////////////
  function doneCheckList(check) {
    let data = _.cloneDeep(modalContent);
    const index = _.findIndex(data.checkListInfo, { checklistNo: check.checklistNo });
    let newCheckList = {
      checklistNo: check.checklistNo,
      checklistContents: check.checklistContents,
      checklistState: check.checklistState === 'done' ? 'do' : 'done',
      taskNo: check.taskNo
    };
    let newCheckList1 = {
      checklistNo: check.checklistNo,
      checklistState: check.checklistState === 'done' ? 'do' : 'done',
      taskNo: check.taskNo
    };
    data.checkListInfo.splice(index, 1, newCheckList);
    const fetchupdate = async () => {
      const response = await fetch(`/haru/api/tasksetting/checklist/update`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(newCheckList1)
      });
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const jsonResult = await response.json();

      if (jsonResult.result != 'success') {
        throw new Error(`${jsonResult.result} ${jsonResult.message}`);
      }
      setModalContent(data);
    };
    fetchupdate();
    const taskName = modalContent.taskCard.taskName;

    fetchInsertHistory(
      window.sessionStorage.getItem('authUserNo'),
      window.sessionStorage.getItem('authUserName'),
      members,
      'checklistStateUpdate',
      taskName,
      projectNo,
      clientRef
    ).then(res =>
      activityLogDispatch({
        type: 'ALADD',
        payload: {
          ...res
        }
      })
    );
  }
  /////////////////////////////////////////////////////////////////////////////////////
  function delCheckList(check) {
    let data = _.cloneDeep(modalContent);
    const checklistNo = check.checklistNo;
    const index = _.findIndex(data.checkListInfo, { checklistNo: checklistNo });
    let newCheckList = {
      checklistNo: checklistNo,
      checklistContents: check.checklistContents,
      checklistState: check.checklistState === 'del' ? 'del' : 'del',
      taskNo: check.taskNo
    };

    data.checkListInfo.splice(index, 1, newCheckList);
    const delcheck = async () => {
      const response = await fetch(`/haru/api/tasksetting/checklist/${checklistNo}`, {
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
      setModalContent(data);
    };

    delcheck();

    const taskName = modalContent.taskCard.taskName;
  }
  /////////////////////////////////////////////////////////////////////////////////////
  function insertcheck() {
    const taskNo = modalContent.taskCard.taskNo;
    const taskName = modalContent.taskCard.taskName;
    const checklistContents = form;
    const NewTodo = { taskNo, checklistContents };
    let data1 = _.cloneDeep(modalContent);
    data1.checkListInfo = [NewTodo, ...data1.checkListInfo];
    //
    console.log(window.sessionStorage.getItem('authUserNo'));
    console.log(window.sessionStorage.getItem('authUserName'));
    console.log(members);
    console.log(taskName);
    console.log(projectNo);
    console.log('clientRef', clientRef);

    fetchInsertHistory(
      window.sessionStorage.getItem('authUserNo'),
      window.sessionStorage.getItem('authUserName'),
      members,
      'checklistInsert',
      taskName,
      projectNo,
      clientRef
    );

    const fetchinsert = async () => {
      const response = await fetch(`/haru/api/tasksetting/checklist/add`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(NewTodo)
      });
      setModalContent(data1);
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const jsonResult = await response.json();

      if (jsonResult.result != 'success') {
        throw new Error(`${jsonResult.result} ${jsonResult.message}`);
      }
    };
    fetchinsert();

    setForm('');
    setOpen(false);
  }
  /////////////////////////////////////////////////////////////////////////////////////

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
          <Button variant="outline-secondary" id="button-addon2" onClick={() => insertcheck()}>
            추가
          </Button>
        </InputGroup>
      </Collapse>
    </>
  );
};
export default ModalCheckListContent;
