import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  CustomInput
} from 'reactstrap';
import Datetime from 'react-datetime';
import { v4 as uuid } from 'uuid';
import Flex from '../common/Flex';
import { localIp } from '../../config';

const AddScheduleModal = ({
  setIsOpenScheduleModal,
  isOpenScheduleModal,
  setInitialEvents,
  initialEvents,
  addScheduleStartDate,
  setAddScheduleStartDate,
  isOpen
}) => {
  const toggle = () => setIsOpenScheduleModal(!isOpenScheduleModal);

  const [formObj, setFormObj] = useState();
  const [endDate, setEndDate] = useState();
  const [startDate, setStartDate] = useState();

  const closeBtn = (
    <button className="close font-weight-normal" onClick={toggle}>
      &times;
    </button>
  );

  const handleChange = target => {
    let name = target.name;
    let value = name === 'allDay' ? target.checked : target.value;
    setFormObj({ ...formObj, [name]: value });
    console.log(formObj);
  };

  const handleAdd = async formObj => {
    try {
      const response = await fetch(`${localIp}/api/calendar/add`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(formObj)
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const jsonResult = await response.json();
      console.log('add', jsonResult.data);
      let data = {
        title: jsonResult.data.scheduleContents,
        start: jsonResult.data.scheduleStart,
        end: jsonResult.data.scheduleEnd
      };
      console.log(data);
      setInitialEvents([...initialEvents, data]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    !isOpenScheduleModal && setAddScheduleStartDate(null);
    !isOpenScheduleModal && setEndDate(null);
    !isOpenScheduleModal && setStartDate(null);
    setFormObj({ ...formObj, start: addScheduleStartDate });
    // eslint-disable-next-line
  }, [isOpenScheduleModal, addScheduleStartDate]);

  return (
    <Modal isOpen={isOpenScheduleModal} toggle={toggle} modalClassName="theme-modal" contentClassName="border">
      <Form
        onSubmit={e => {
          e.preventDefault();
          handleAdd(formObj);
          setIsOpenScheduleModal(false);
          setInitialEvents([...initialEvents, formObj]);
        }}
      >
        <ModalHeader toggle={toggle} className="bg-light d-flex flex-between-center border-bottom-0" close={closeBtn}>
          일정 추가
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label className="fs-0" for="eventTitle">
              제목
            </Label>
            <Input name="scheduleContents" id="eventTitle" required onChange={({ target }) => handleChange(target)} />
          </FormGroup>

          <FormGroup>
            <Label className="fs-0" for="eventStart">
              시작일
            </Label>
            {/* 시작일 날짜 */}
            <Datetime
              timeFormat={true}
              value={startDate || addScheduleStartDate}
              onChange={dateTime => {
                if (dateTime._isValid) {
                  setStartDate(dateTime);
                  let date = {};
                  date.value = dateTime.format('YYYY-MM-DD HH:mm:ss');
                  date.name = 'scheduleStart';
                  handleChange(date);
                }
              }}
              dateFormat="YYYY-DD-MM HH:mm:ss"
              inputProps={{ placeholder: 'YYYY-MM-DD HH:mm:ss', id: 'eventStart' }}
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
                  date.value = dateTime.format('YYYY-MM-DD HH:mm:ss');
                  date.name = 'scheduleEnd';
                  handleChange(date);
                }
              }}
              dateFormat="YYYY-DD-MM HH:mm:ss"
              inputProps={{ placeholder: 'YYYY-DD-MM HH:mm:ss', id: 'eventEnd' }}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter tag={Flex} justify="end" align="center" className="bg-light border-top-0">
          <Button color="primary" type="submit" className="px-4">
            Save
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddScheduleModal;
