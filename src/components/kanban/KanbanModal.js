import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { Collapse, FormControl, InputGroup } from 'react-bootstrap';
import { HexColorPicker } from 'react-colorful';
import Datetime from 'react-datetime';
import {
  Button,
  Col,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  Row,
  UncontrolledButtonDropdown
} from 'reactstrap';
import AppContext, { KanbanContext } from '../../context/Context';
import Background from '../common/Background';
import ModalAttachmentsContent from './ModalAttachmentsContent';
import ModalCheckListContent from './ModalCheckListContent';
import ModalCommentContent from './ModalCommentContent';
import ModalDescContent from './ModalDescContent';
import ModalLabelContent from './ModalLabelContent';
import ModalMediaContent from './ModalMediaContent';

const API_HEADERS = {
  'Context-Type': 'application/json'
};
const KanbanModal = ({ modal, setModal, className }) => {
  const {
    fetchInsertHistory,
    modalContent,
    setModalContent,
    kanbanTaskCards,
    kanbanTaskCardsDispatch,
    kanbanColumnsDispatch,
    history,
    setHistory,
    members,
    $websocket
  } = useContext(KanbanContext);
  const [color, setColor] = useState('#aabbcc');
  const [selectedFile, setSelectedFile] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [form, setForm] = useState('');
  const [open, setOpen] = useState(false);
  const { projectNo, activityLog, activityLogDispatch } = useContext(AppContext);
  // const [addScheduleStartDate, setAddScheduleStartDate] = useState();
  const [isOpenScheduleModal, setIsOpenScheduleModal] = useState(false);
  const [endDate, setEndDate] = useState();
  const [startDate, setStartDate] = useState();
  //////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////
  const toggle = () => {
    setModal(!modal);
    setIsOpenScheduleModal(!isOpenScheduleModal);
  };

  useEffect(() => {
    if (modal) {
      !isOpenScheduleModal && setEndDate(modalContent.taskCard.taskEnd);
      !isOpenScheduleModal && setStartDate(modalContent.taskCard.taskStart);

      const fun = async () => {
        try {
          const response = await fetch(`/haru/api/tasksetting/${modalContent.taskCard.taskNo}`, { method: 'get' });

          if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
          }
          const jsonResult = await response.json();
          if (jsonResult.result != 'success') {
            throw new Error(`${jsonResult.result} ${jsonResult.message}`);
          }
          const { checkListInfo, commentsInfo, filesInfo, tagsInfo } = jsonResult.data;

          // console.log('따끈따끈fetch데이터들', jsonResult);
          let data = _.cloneDeep(modalContent);
          data.checkListInfo = checkListInfo;
          data.commentsInfo = commentsInfo;
          data.filesInfo = filesInfo;
          data.tagsInfo = tagsInfo;
          data.commentsInfo.map(item => (item.taskNo = modalContent.taskCard.taskNo));
          // data.commentsInfo.taskNo = modalContent.taskCard.taskNo;

          // console.log('새로운 데이터 setting 잘됬나', data);
          setModalContent(data);
          console.log('data', data);
          // console.log('Modal 들어와서 modalContent', modalContent);
        } catch (err) {
          console.log(err);
        }
      };
      fun();
    }
  }, [modal]);
  // formData라는 instance에 담아 보냄
  // onChange역할

  const colorset = () => {
    const taskNo = modalContent.taskCard.taskNo;
    const taskLabel = color;
    const taskData = { taskNo: taskNo, taskLabel: taskLabel };

    const updatecolor = async () => {
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
    updatecolor();
    let data = _.cloneDeep(modalContent);
    data.taskCard.taskLabel = taskLabel;

    const data2 = data.taskCard;
    const id = data2.taskNo;

    kanbanColumnsDispatch({
      type: 'TASKLABEL',
      payload: data2,
      id: id
    });
  };
  const handleChange = async target => {
    // modalContent.taskCard.taskStart;
    // modalContent.taskCard.taskEnd;
    let value = target.value;
    let data = _.cloneDeep(modalContent);
    const taskNo = data.taskCard.taskNo;
    const taskName = data.taskCard.taskName;
    console.log(value, ' value로 바뀜');
    let newData = {};
    if (target.name === 'scheduleStart') {
      data.taskCard.taskStart = value;
      setModalContent(data);
      setStartDate(value);
      newData = { taskNo: taskNo, taskStart: value };
    } else if (target.name === 'scheduleEnd') {
      data.taskCard.taskEnd = value;
      setModalContent(data);
      setEndDate(value);
      newData = { taskNo: taskNo, taskEnd: value };
    }
    const updateDate = async () => {
      const response = await fetch(`/haru/api/tasksetting/task/update`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(newData)
      });
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const jsonResult = await response.json();
      if (jsonResult.result != 'success') {
        throw new Error(`${jsonResult.result} ${jsonResult.message}`);
      }
    };
    updateDate();
    const clientRef = $websocket;
    fetchInsertHistory(
      window.sessionStorage.getItem('authUserNo'),
      window.sessionStorage.getItem('authUserName'),
      members,
      'taskDateUpdate',
      taskName,
      projectNo,
      clientRef
    );
  };

  function updataTaskName() {
    const NewtaskName = form;
    let data = _.cloneDeep(modalContent);
    const taskNo = data.taskCard.taskNo;
    data.taskCard.taskName = NewtaskName;
    setForm('');
    setOpen(false);

    const taskData = { taskNo: taskNo, taskName: NewtaskName };
    const updatetitle = async () => {
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
    updatetitle();
    setModalContent(data);
    const data2 = data.taskCard;
    const id = data2.taskNo;
    kanbanColumnsDispatch({
      type: 'TASKNAME',
      payload: data2,
      id: id
    });
    const taskContents = NewtaskName;
    const clientRef = $websocket;

    fetchInsertHistory(
      window.sessionStorage.getItem('authUserNo'),
      window.sessionStorage.getItem('authUserName'),
      members,
      'taskContentsUpdate',
      taskContents,
      projectNo,
      clientRef
    );
  }
  function handleFileChange(event) {
    setSelectedFile(event.target.files[0]);
  }
  const handleFileUpload = event => {
    if (
      selectedFile !== null &&
      (selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        selectedFile.type === 'image/png' ||
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
        selectedFile.type === 'text/plain' ||
        selectedFile.type === 'image/jpeg' ||
        selectedFile.type === 'application/vnd.ms-excel' ||
        selectedFile.type === 'application/x-zip-compressed' ||
        selectedFile.type === 'application/haansofthwp')
    ) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('taskNo', modalContent.taskCard.taskNo);
      formData.append('userNo', window.sessionStorage.getItem('authUserNo'));

      fetch(`/haru/api/upload`, {
        method: 'post',
        headers: API_HEADERS,
        body: formData
      })
        .then(response => response.json())
        .then(json => {
          json.data.taskListNo = modalContent.taskCard.taskListNo;

          let data = _.cloneDeep(modalContent);
          data.filesInfo = [...data.filesInfo, json.data];
          setModalContent(data);
        });
    } else {
      const newAlert = {
        id: new Date().getTime(),
        type: 'danger',
        message: '지원하지 않는 파일 형식입니다.'
      };
      setAlerts([...alerts, newAlert]);
      alert(alerts);
    }
  };

  return modal ? (
    <Modal
      isOpen={modal}
      toggle={toggle}
      className={`mt-6 ${className ? className : ''}`}
      contentClassName="border-0"
      modalClassName="theme-modal"
      size="lg"
    >
      <ModalBody className="p-0">
        {modalContent.taskCardImage && (
          <div className="position-relative overflow-hidden py-8">
            <Background image={modalContent.taskCardImage.url} className="rounded-soft-top" />
          </div>
        )}

        <div className="bg-light rounded-soft-top px-4 py-3">
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
            업무 명 : {modalContent.taskCard.taskName}
          </Button>
          <Collapse in={open}>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="제목을 입력해 주세요."
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                onChange={e => setForm(e.target.value)}
                value={form}
              />
              <Button variant="outline-secondary" id="button-addon2" onClick={() => updataTaskName()}>
                수정
              </Button>
            </InputGroup>
          </Collapse>
          <p className="fs--2 mb-0">Added by{modalContent.taskCard.taskWriter}</p>
        </div>

        <div className="position-absolute t-0 r-0  z-index-1">
          <Button
            size="sm"
            className="close close-circle d-flex flex-center transition-base mt-3 mr-3"
            onClick={() => toggle()}
          >
            <FontAwesomeIcon icon="times" transform="shrink-6 right-0.3 down-0.3" />
          </Button>
        </div>
        <div className="p-4">
          <Row>
            <Col lg="10">
              <ModalMediaContent title="할 일 리스트" icon="list-ul" headingClass="mb-3" isHr={false}>
                <ModalCheckListContent
                  clientRef={$websocket}
                  members={members}
                  fetchInsertHistory={fetchInsertHistory}
                />
              </ModalMediaContent>
              <ModalMediaContent title="라벨 컬러" icon="list-ul" headingClass="mb-3" isHr={false}>
                <HexColorPicker color={color} onChange={setColor} />;<button onClick={colorset}>컬러 셋팅 </button>
              </ModalMediaContent>
              <hr />
              <br />
              <FormGroup>
                <Label className="fs-0" for="eventStart">
                  시작일
                </Label>
                {/* 시작일 날짜 */}
                <Datetime
                  timeFormat={true}
                  value={startDate}
                  onChange={dateTime => {
                    if (dateTime._isValid) {
                      setStartDate(dateTime);
                      let date = {};
                      date.value = dateTime.format('YYYY-MM-DD');
                      date.name = 'scheduleStart';
                      handleChange(date);
                    }
                  }}
                  dateFormat="YYYY-MM-DD"
                  inputProps={{ placeholder: 'YYYY-MM-DD', id: 'eventStart' }}
                />
              </FormGroup>

              <FormGroup>
                <Label className="fs-0" for="eventEnd">
                  마감일
                </Label>
                {/* 마감일 날짜 */}
                <Datetime
                  value={endDate}
                  timeFormat={true}
                  onChange={dateTime => {
                    if (dateTime._isValid) {
                      setEndDate(dateTime);
                      let date = {};
                      date.value = dateTime.format('YYYY-MM-DD');
                      date.name = 'scheduleEnd';
                      handleChange(date);
                    }
                  }}
                  dateFormat="YYYY-MM-DD"
                  inputProps={{ placeholder: 'YYYY-MM-DD', id: 'eventEnd' }}
                />
              </FormGroup>
              <hr />
              <br />
              {/* //labels */}
              <ModalMediaContent title="태그" icon="tag">
                <ModalLabelContent
                  key={modalContent.taskCard && modalContent.taskCard.taskNo}
                  clientRef={$websocket}
                  members={members}
                  fetchInsertHistory={fetchInsertHistory}
                />
              </ModalMediaContent>
              {/* //description */}
              <ModalMediaContent title="테스크 설명" icon="paperclip">
                <p className="text-word-break fs--1">{modalContent.taskCard && modalContent.taskCard.taskContents}</p>
                <ModalDescContent clientRef={$websocket} members={members} fetchInsertHistory={fetchInsertHistory} />
              </ModalMediaContent>
              {/* //Attachment */}
              <ModalMediaContent
                title="첨부파일"
                icon="paperclip"
                headingClass="d-flex justify-content-between"
                headingContent={
                  <UncontrolledButtonDropdown direction="right">
                    <DropdownToggle caret size="sm" color="falcon-default" className="dropdown-caret-none fs--2">
                      <FontAwesomeIcon icon="plus" />
                    </DropdownToggle>
                    <DropdownMenu>
                      <div>
                        <input type="file" onChange={handleFileChange} />
                        <button onClick={handleFileUpload}>업로드</button>
                      </div>
                    </DropdownMenu>
                  </UncontrolledButtonDropdown>
                }
              >
                <ModalAttachmentsContent />
              </ModalMediaContent>
              {/* //Comment */}
              <ModalMediaContent title="댓글" icon={['far', 'comment']} headingClass="mb-3">
                <ModalCommentContent clientRef={$websocket} members={members} fetchInsertHistory={fetchInsertHistory} />
              </ModalMediaContent>
              {/* //Activity */}
            </Col>
          </Row>
        </div>
      </ModalBody>
    </Modal>
  ) : (
    <> </>
  );
};

export default KanbanModal;
