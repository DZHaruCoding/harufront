import React, { useContext, useEffect, useState } from 'react';
import { Button, Badge, UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import _ from 'lodash';
import { KanbanContext } from '../../context/Context';

const ModalLabelContent = () => {
  const { modalContent, setModalContent } = useContext(KanbanContext);
  const [tagList, setTagList] = useState([]);

  useEffect(() => {
    axios
      .get(`/haru/api/taglist`)
      .then(response => {
        // console.log('키는 뭘까', modalContent.taskCard.taskNo);
        // console.log('키가 들어갈 data', response.data.data);
        let data = _.cloneDeep(response.data.data);
        // data.map(item => (item.taskNo = modalContent.taskCard.taskNo));
        // console.log('axios로 불러온 data', data);
        setTagList(data);
      })
      .catch(err => console.error(err));
  }, []);
  function onClickSetTaskInfo(tag, tagNo) {
    // console.log('지금 taskData', modalContent.tagsInfo);
    // console.log('새로넣을 tag', [tag]);
    const newTaskTag = { tagNo: tagNo, taskNo: modalContent.taskCard.taskNo };
    console.log('🚀 새로넣을태그정보', newTaskTag);
    let data = _.cloneDeep(modalContent);
    data.tagsInfo = data.tagsInfo.filter(item => item.tagNo != tagNo);
    if (data) {
      data.tagsInfo = [tag, ...data.tagsInfo];
    } else {
      data.tagsInfo = [tag];
    }

    const taginsert = async () => {
      const response = await fetch(`/haru/api/tag/add`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(newTaskTag)
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
    taginsert();
    // console.log('modalTags확인용', modalContent);
  }

  function deltag(tagNo) {
    const taskNo = modalContent.taskCard.taskNo;
    const delcheck = async () => {
      const response = await fetch(`/haru/api/tag/${taskNo}/${tagNo}`, {
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
      const filteredState = modalContent.tagsInfo.filter(item => item.tagNo !== tagNo);
      data.tagsInfo = filteredState;
      setModalContent(data);
    };
    delcheck();
  }

  return (
    <>
      {modalContent.tagsInfo &&
        modalContent.tagsInfo.map((tag, index) => {
          return (
            <Badge
              className={`d-inline-block py-1 mr-1 mb-1`}
              style={{ color: '#FFFFFF', backgroundColor: tag.tagColor }}
              key={index}
              onClick={() => {
                deltag(tag.tagNo);
              }}
            >
              {tag.tagName}
            </Badge>
          );
        })}

      <UncontrolledButtonDropdown direction="right">
        <DropdownToggle caret size="sm" color="secondary" className="px-2 fsp-75 bg-400 border-400 dropdown-caret-none">
          <FontAwesomeIcon icon="plus" />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header className="py-0 px-3 mb-0">
            Select tag
          </DropdownItem>
          <DropdownItem divider />
          <div className="px-3">
            {tagList &&
              tagList.map((tag, index) => {
                return (
                  <button
                    className={`d-inline-block py-1 mr-1 mb-1`}
                    style={{ color: '#FFFFFF', backgroundColor: tag.tagColor }}
                    key={index}
                    onClick={() => {
                      onClickSetTaskInfo(tag, tag.tagNo, tag.taskNo);
                    }}
                  >
                    {tag.tagName}
                  </button>
                );
              })}
          </div>
          <DropdownItem divider />
          <div className="px-3">
            <Button size="sm" block color="outline-secondary" className="border-400">
              Create Label
            </Button>
          </div>
        </DropdownMenu>
      </UncontrolledButtonDropdown>
    </>
  );
};

export default ModalLabelContent;
