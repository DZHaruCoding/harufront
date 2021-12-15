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
import Flex from '../../common/Flex';
//import { localIp } from '../../../config';
import _, { set } from 'lodash';

const AuthUserModal = ({
  setIsOpenAuthUserModal,
  callback,
  no,
  title,
  start,
  end,
  eventData,
  isOpen
}) => {

  const toggle = () => setIsOpenAuthUserModal(!isOpen);

  const [formObj, setFormObj] = useState([]);
  const [endDate, setEndDate] = useState(end);
  const [startDate, setStartDate] = useState(start);
  const [bbb, setBbb] = useState(title);



  const closeBtn = (
    <button className="close font-weight-normal" onClick={toggle}>
      &times;
    </button>
  );


  const handleUpdate = (formObj) => {
    const update = async () => {
      try {
        const response = await fetch(`/api/calendar/update/` + no, {
          method: "put",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formObj)
        });

        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }

        const jsonResult = await response.json();
        console.log('update', jsonResult.data);
        let data = {
          id: jsonResult.data.scheduleNo,
          title: jsonResult.data.scheduleContents,
          start: jsonResult.data.scheduleStart,
          end: jsonResult.data.scheduleEnd
        };
        // console.log('update fetch 확인 데이터 : ',data);
        // setInitialEvents([initialEvents, data]);

        callback(data)


      } catch (error) {
        console.log(error);
      }
    }
    update();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} modalClassName="theme-modal" contentClassName="border">
      <Form
        onSubmit={e => {
          e.preventDefault();
          handleUpdate(formObj);
          setIsOpenAuthUserModal(false);
        }}
      >
        <ModalHeader toggle={toggle} className="bg-light d-flex flex-between-center border-bottom-0" close={closeBtn}>
          인증 메일이 전송되 었습니다.
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label className="fs-0" for="eventTitle">
              인증번호가 일치해야 로그인이 가능합니다
            </Label>
            <Input name="scheduleContents" id="eventTitle" value={null}
              placeholder='인증번호를 입력하세요'/>
          </FormGroup>

        </ModalBody>
        <ModalFooter tag={Flex} justify="end" align="center" className="bg-light border-top-0">

          <Button color="primary" type="submit" className="px-4">
            인증하기
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AuthUserModal;
