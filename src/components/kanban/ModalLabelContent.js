import React, { useContext, useEffect, useState } from 'react';
import { Button, Badge, UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import _ from 'lodash';
import { KanbanContext } from '../../context/Context';
import { ButtonGroup, FormControl, Modal, ToggleButton } from 'react-bootstrap';

const ModalLabelContent = ({ clientRef, members, fetchInsertHistory }) => {
  const [modalShows, setmodalShows] = useState(false);
  const [radioValue, setRadioValue] = useState('1');
  const [form, setForm] = useState('');
  const { modalContent, setModalContent } = useContext(KanbanContext);
  const [tagList, setTagList] = useState([]);
  const radios = [
    { name: 'blue', value: '#0003D3' },
    { name: 'gray', value: '#AAAAAA' },
    { name: 'skyblue', value: '#1CD3EF' },
    { name: 'orenge', value: '#FF0004' },
    { name: 'red', value: '#FF1E1E' },
    { name: 'black', value: '#000000' }
  ];
  useEffect(() => {
    axios
      .get(`/haru/api/taglist`)
      .then(response => {
        let data = _.cloneDeep(response.data.data);
        setTagList(data);
      })
      .catch(err => console.error(err));
  }, []);

  function onClickSetTaskInfo(tag, tagNo) {
    // console.log('지금 taskData', modalContent.tagsInfo);
    // console.log('새로넣을 tag', [tag]);
    const newTaskTag = { tagNo: tagNo, taskNo: modalContent.taskCard.taskNo };
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
  function insertTaglist() {
    console.log(form);
    console.log(radioValue);

    let NewData = { tagName: form, tagColor: radioValue };
    const inserttag = async () => {
      const response = await fetch(`/haru/api/taglist/add`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(NewData)
      });
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
    };
    inserttag();
    axios
      .get(`/haru/api/taglist`)
      .then(response => {
        let data = _.cloneDeep(response.data.data);
        setTagList(data);
      })
      .catch(err => console.error(err));
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
            <Button
              size="sm"
              block
              color="outline-secondary"
              className="border-400"
              onClick={() => setmodalShows(true)}
            >
              Create Label
            </Button>

            <Modal show={modalShows} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  1.태그의 색을 선택하고 2.태그의 이름을 입력하여 주세요.
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ButtonGroup>
                  {radios.map((radio, idx) => (
                    <ToggleButton
                      key={idx}
                      id={`radio-${idx}`}
                      type="radio"
                      variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                      name="radio"
                      value={radio.value}
                      checked={radioValue === radio.value}
                      onChange={e => setRadioValue(e.currentTarget.value)}
                    >
                      {radio.name}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
                <FormControl
                  placeholder="태그의 이름을 입력해주세요..."
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                  onChange={e => setForm(e.target.value)}
                  value={form}
                />
              </Modal.Body>
              <Modal.Footer>
                <button
                  className={`d-inline-block py-1 mr-1 mb-1`}
                  style={{ color: 'black' }}
                  onClick={() => {
                    setmodalShows(false);
                    insertTaglist();
                  }}
                >
                  라벨 추가
                </button>
              </Modal.Footer>
            </Modal>
          </div>
        </DropdownMenu>
      </UncontrolledButtonDropdown>
    </>
  );
};

export default ModalLabelContent;
