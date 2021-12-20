import React, { useContext, useEffect, useReducer, useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  Row,
  Col,
  UncontrolledButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input
} from 'reactstrap';
import Background from '../common/Background';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ModalMediaContent from './ModalMediaContent';
import _ from 'lodash';
import ModalLabelContent from './ModalLabelContent';
import ModalAttachmentsContent from './ModalAttachmentsContent';
import ModalCommentContent from './ModalCommentContent';
import ModalCheckListContent from './ModalCheckListContent';
import { KanbanContext } from '../../context/Context';
import ModalDescContent from './ModalDescContent';
import { Collapse, FormControl, InputGroup } from 'react-bootstrap';
import { arrayReducer } from '../../reducers/arrayReducer';
const API_URL = 'http://localhost:8080/haru';
const API_HEADERS = {
  'Context-Type': 'application/json'
};
const KanbanModal = ({ modal, setModal, className }) => {
  const { modalContent, setModalContent, kanbanTaskCards, kanbanTaskCardsDispatch, kanbanColumnsDispatch } = useContext(KanbanContext);
  const [selectedFile, setSelectedFile] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [form, setForm] = useState('');
  const [open, setOpen] = useState(false);

  const toggle = () => setModal(!modal);
  useEffect(() => {
    if (modal) {
      const fun = async () => {
        try {
          const response = await fetch(`haru/api/tasksetting/${modalContent.taskCard.taskNo}`, { method: 'get' });

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
  function updataTaskName() {
    const NewtaskName = form;
    let data = _.cloneDeep(modalContent);
    data.taskCard.taskName = NewtaskName;
    setModalContent(data);
    setForm('');
    setOpen(false);
    const data2 = data.taskCard;
    const id = data2.taskNo;
    const order = data2.taskOrder;

    // kanbanTaskCardsDispatch({
    //   type: 'TASKNAME',
    //   payload: { data2, order },
    //   id: id
    // });

    kanbanColumnsDispatch({
      type: 'TASKNAME',
      payload: data2,
      id: id
    })

    // newTaskList = update(newTaskList, {
    //   [taskListIndex]: {
    //     tasks: {
    //       [taskIndex]: {
    //         checkList: {
    //           [checklistIndex]: {
    //             socketType: { $set: 'checklistInsert' },
    //             taskListIndex: { $set: taskListIndex },
    //             taskIndex: { $set: taskIndex },
    //             authUserNo: { $set: sessionStorage.getItem('authUserNo') },
    //             projectNo: { $set: this.props.match.params.projectNo },
    //             members: { $set: this.state.projectMembers }
    //           }
    //         }
    //       }
    //     }
    //   }
    // });
    // kanbanTaskCardsDispatch({ type: 'TASKNAME', payload: { data2 } });
  }
  function handleFileChange(event) {
    setSelectedFile(event.target.files[0]);
  }
  const handleFileUpload = event => {
    console.log(selectedFile);
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

      formData.append('file', selectedFile, selectedFile.name);
      formData.append('taskNo', modalContent.taskCard.taskNo);
      formData.append('userNo', '1');

      fetch(`${API_URL}/api/upload`, {
        method: 'post',
        headers: API_HEADERS,
        body: formData
      })
        .then(response => response.json())
        .then(json => {
          json.data.taskListNo = modalContent.taskCard.taskListNo;
          console.log(json.data);
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
                <ModalCheckListContent />
              </ModalMediaContent>
              <hr />
              <br />
              {/* //Group member */}
              {/* //labels */}
              <ModalMediaContent title="태그" icon="tag">
                <ModalLabelContent key={modalContent.taskCard && modalContent.taskCard.taskNo} />
              </ModalMediaContent>
              {/* //description */}
              <ModalMediaContent title="테스크 설명" icon="paperclip">
                <p className="text-word-break fs--1">{modalContent.taskCard && modalContent.taskCard.taskContents}</p>
                <ModalDescContent />
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
                <ModalCommentContent />
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
