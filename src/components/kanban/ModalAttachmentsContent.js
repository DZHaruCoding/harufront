import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal, ModalBody } from 'reactstrap';

import { attachments } from '../../data/kanban/kanbanItems';
import FalconLightBox from '../common/FalconLightBox';
import { Link } from 'react-router-dom';
import Background from '../common/Background';
import { Media } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { KanbanContext, ProductContext } from '../../context/Context';
import { Image } from 'react-bootstrap';
import axios from 'axios';
import _ from 'lodash';
const API_URL = 'http://localhost:8080';
const ModalAttachmentsContent = () => {
  const [nestedModal, setNestedModal] = useState(false);
  const { modalContent, setModalContent } = useContext(KanbanContext);
  // const [filesInfo, setFilesInfo] = useState(modalContent.filesInfo);
  const { filesInfo } = modalContent;

  function updataAttachments(val) {
    let data = _.cloneDeep(modalContent);
    data.commentsInfo = [val, ...data.commentsInfo];
    setModalContent(data);
  }
  useEffect(() => {
    // console.log('Modal첨부파일', modalContent.filesInfo);
    // changeName: "202111179152736.jpg"
    // fileMaker: "이종윤"
    // fileNo: 19
    // filePath: "/assets/upimages/202111179152736.jpg"
    // fileRegdate: "2021년 12월 17일"
    // fileState: null
    // originName: "개발자종윤.jpg"
    // projectNo: null
    // projectTitle: null
    // taskContents: null
    // taskNo: 1
    // taskState: null
    // tasklistName: null
    // tasklistNo: null
    // userName: null
    // userNo: null
    // {
    // modalContent.filesInfo.originName.split('.')[1] === 'png' ||
    //   modalContent.filesInfo.originName.split('.')[1] === 'jpg';
    //   ? 'image' :
    // }
    // const {} = modalContent.filesInfo;
  });

  const toggleNested = () => {
    setNestedModal(!nestedModal);
  };

  const externalCloseBtn = (
    <button
      className="close text-secondary p-3"
      style={{ position: 'absolute', top: '15px', right: '15px' }}
      onClick={toggleNested}
    >
      <FontAwesomeIcon icon="times" transform="right-0.3 down-0.3" />
    </button>
  );

  // data.tagsInfo = filteredState;
  // setModalContent(data);
  // const newInfo = [];
  function onClickDeleteFile(id) {
    if (window.confirm('파일을 삭제하시겠습니까?')) {
      const delfile = async () => {
        const response = await fetch(`/haru/api/file/del/${id}`, {
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
        let data = _.cloneDeep(modalContent);
        const filteredState = modalContent.filesInfo.filter(item => item.fileNo !== id);
        data.filesInfo = filteredState;
        setModalContent(data);
      };
      delfile();
    }
  }

  console.log(modalContent);
  function downloadFile(fileNo) {
    if (window.confirm('파일을 다운로드 하시겠습니까?')) {
      downloadData(fileNo);
    }
  }

  function downloadData(fileNo) {
    //blob : 이미지, 사운드, 비디오와 같은 멀티미디어 데이터를 다룰 때 사용, MIME 타입을 알아내거나, 데이터를 송수신
    fetch(`haru/api/download/${fileNo}`).then(response => {
      console.log(`${fileNo}`);
      const filename = response.headers.get('Content-Disposition').split('filename=')[1];
      console.log(filename);
      response.blob().then(blob => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
      });
    });
  }
  return (
    <>
      {filesInfo &&
        filesInfo.map((item, index) => {
          return (
            <Media key={index} className={index !== item.length - 1 && 'mb-3'}>
              <div className="bg-attachment mr-3">
                {item.originName.split('.')[1] === 'png' || item.originName.split('.')[1] === 'jpg' ? (
                  <>
                    <FalconLightBox imgSrc={`${API_URL}/haru${item.filePath}`}>
                      <Image src={`${API_URL}/haru${item.filePath}`} className="rounded" />
                    </FalconLightBox>
                  </>
                ) : (
                  <span className="text-uppercase font-weight-bold">
                    <Image src={`${API_URL}/haru${item.filePath}`} className="rounded" />
                  </span>
                )}
              </div>

              <Media body className="fs--2">
                <h6 className="mb-1 text-primary">
                  {item.originName.split('.')[1] === 'png' || item.originName.split('.')[1] === 'jpg' ? (
                    <>
                      <FalconLightBox imgSrc={`${API_URL}/haru${item.filePath}`}>
                        <Link
                          to={window.location.href}
                          className="text-decoration-none"
                          onClick={() => downloadFile(item.fileNo)}
                        >
                          {item.originName}
                        </Link>
                      </FalconLightBox>
                    </>
                  ) : (
                    <a href="#!" className="text-decoration-none">
                      {item.originName}
                    </a>
                  )}
                </h6>
                <span className="mx-1">|</span>
                <Link
                  to={'#'}
                  className="text-600 font-weight-semi-bold"
                  onClick={() => onClickDeleteFile(item.fileNo)}
                >
                  Remove
                </Link>
                <p className="mb-0">Uploaded at{item.fileRegdate} </p>
              </Media>
              <Modal
                isOpen={nestedModal}
                toggle={toggleNested}
                external={externalCloseBtn}
                size="xl"
                centered
                contentClassName="bg-transparent border-0"
              />
            </Media>
          );
        })}
    </>
  );
};

export default ModalAttachmentsContent;
