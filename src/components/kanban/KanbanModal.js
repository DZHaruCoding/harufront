import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  Row,
  Col,
  UncontrolledButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from 'reactstrap';
import Background from '../common/Background';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GroupMember from './GroupMember';
import users from '../../data/dashboard/users';
import ModalMediaContent from './ModalMediaContent';

import ModalLabelContent from './ModalLabelContent';
import ModalAttachmentsContent from './ModalAttachmentsContent';
import ModalCommentContent from './ModalCommentContetn';
import ModalActivityContent from './ModalActivityContent';
import ModalSideContent from './modalSideContent';
import axios from 'axios';
import { KanbanContext } from '../../context/Context';
import UpdateModalDesc from './UpdateModalDesc';
const KanbanModal = ({ modal, setModal, className }) => {
  const { modalContent, setModalContent } = useContext(KanbanContext);
  const [showForm, setShowForm] = useState(false);
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

          let data = modalContent;
          data.checkListInfo = checkListInfo;
          data.commentsInfo = commentsInfo;
          data.filesInfo = filesInfo;
          data.tagsInfo = tagsInfo;

          // console.log('새로운 데이터 setting 잘됬나', data);
          setModalContent(data);
          // console.log('Modal 들어와서 modalContent', modalContent);
        } catch (err) {
          console.log(err);
        }
      };

      fun();
    }
  }, [modal]);
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
          <h4 className="mb-1">{modalContent.taskCard && modalContent.taskCard.taskName} </h4>
          <p className="fs--2 mb-0">
            Added by{' '}
            <a href="#!" className="text-600 font-weight-semi-bold">
              Antony
            </a>
          </p>
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
            <Col lg="12">
              {/* //Group member */}
              {/* //labels */}
              <ModalMediaContent title="태그" icon="tag">
                <ModalLabelContent key={modalContent.taskCard && modalContent.taskCard.taskNo} />
              </ModalMediaContent>
              {/* //description */}
              <ModalMediaContent title="테스크 설명" icon="paperclip">
                <p className="text-word-break fs--1">{modalContent.taskCard.taskContents}</p>
                <UpdateModalDesc />
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
                      <DropdownItem>내 드라이브</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledButtonDropdown>
                }
              >
                <ModalAttachmentsContent />
              </ModalMediaContent>
              {/* //Comment */}
              <ModalMediaContent title="Comments" icon={['far', 'comment']} headingClass="mb-3">
                <ModalCommentContent />
              </ModalMediaContent>
              {/* //Activity */}
              <ModalMediaContent title="Activity" icon="list-ul" headingClass="mb-3" isHr={false}>
                <ModalActivityContent />
              </ModalMediaContent>
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
