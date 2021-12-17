import React, { useContext, useEffect, useState } from 'react';
import { Modal, ModalBody } from 'reactstrap';

import { attachments } from '../../data/kanban/kanbanItems';
import FalconLightBox from '../common/FalconLightBox';
import { Link } from 'react-router-dom';
import Background from '../common/Background';
import { Media } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { KanbanContext } from '../../context/Context';

const ModalAttachmentsContent = () => {
  const [nestedModal, setNestedModal] = useState(false);
  const { modalContent, setModalContent } = useContext(KanbanContext);
  useEffect(() => {
    console.log('Modal첨부파일', modalContent.filesInfo);
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
    //   modalContent.filesInfo.originName.split('.')[1] === 'png' ||
    //     modalContent.filesInfo.originName.split('.')[1] === 'jpg';
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

  return (
    <>
      {/*  Modal수정중....................... */}
      {attachments.map((item, index) => {
        return (
          <Media key={index} className={index !== item.length - 1 && 'mb-3'}>
            <div className="bg-attachment mr-3">
              {item.image ? (
                <>
                  <FalconLightBox imgSrc={item.image}>
                    <Background image={item.image} className="rounded" />
                  </FalconLightBox>
                </>
              ) : (
                <span className="text-uppercase font-weight-bold">{item.type}</span>
              )}
            </div>

            <Media body className="fs--2">
              <h6 className="mb-1 text-primary">
                {item.image ? (
                  <>
                    {item.type !== 'video' && (
                      <FalconLightBox imgSrc={item.image}>
                        <Link to="#!" className="text-decoration-none">
                          {item.title}
                        </Link>
                      </FalconLightBox>
                    )}
                  </>
                ) : (
                  <a href="#!" className="text-decoration-none">
                    {item.title}
                  </a>
                )}
              </h6>
              <span className="mx-1">|</span>
              <Link className="text-600 font-weight-semi-bold" to="#!">
                Remove
              </Link>
              <p className="mb-0">Uploaded at{item.date} </p>
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
