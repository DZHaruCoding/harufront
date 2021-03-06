import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import Image from 'react-bootstrap/Image';
import DefaultImage from '../../assets/img/Default.png';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ProfileContext } from '../../context/Context';


const ProfileDetail = () => {
  const [userName, setUserName] = useState(''); // 이름
  const [userdept, setUserDept] = useState(''); // 부서
  const [usertitle, setUserTitle] = useState(''); // 직함
  const [userEmail, setUserEmail] = useState(window.sessionStorage.getItem('authUserEmail')); // 이메일
  const [userPhoto, setUserPhoto] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const {ProfilePhoto, setProfilePhoto} = useContext(ProfileContext);

  const CheckedEmail = e => {
    setUserEmail(e.target.value);
  };
  const ChangeUserName = e => {
    setUserName(e.target.value);
    console.log(selectedFile);
  };
  const ChangeUserdept = e => {
    setUserDept(e.target.value);
  };
  const ChangeUsertitle = e => {
    setUserTitle(e.target.value);
  };

  const handlerSubmit = async e => {
    try {
      e.preventDefault();
      console.log(selectedFile);

      if (userName === '') {
        alert('이름은 반드시 입력되어야 합니다');
        throw `사용자 이름은 입력하여야 합니다`;
      }

      const userProfile = {
        userName: userName,
        userDept: userdept,
        userTitle: usertitle,
        userEmail: userEmail
      };

      const response = await fetch(`/haru/user/ChangeProfile`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(userProfile)
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const json = await response.json();

      if (json.result !== 'success') {
        throw json.message;
      }

      if (json.data) {
        setUserName(json.data.userName);
        setUserDept(json.data.userDept);
        setUserTitle(json.data.usertitle);
        setUserPhoto(json.data.userPhoto);
      } else {
      }
    } catch (err) {
      console.log(err);
    }

    toast.success(`변경되었습니다!!!`);
  };

  // 최초 유저정보 가져오기
  const findUserProfile = async e => {
    const emailJson = { userEmail: userEmail };

    try {
      const response = await fetch(`/haru/user/findUserProfile`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(emailJson)
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const json = await response.json();

      if (json.result !== 'success') {
        throw json.message;
      }

      if (json.data) {
        setUserName(json.data.userName);
        setUserTitle(json.data.userTitle);
        setUserDept(json.data.userDept);
        setUserPhoto(json.data.userPhoto);
        setProfilePhoto(json.data.userPhoto);

        console.log("기본이미지 : "+DefaultImage)
        console.log("변경된 이미지 : "+userPhoto)
      }
    } catch (err) {
      console.log(err);
    }
  };

  const ImgChange = e => {
    const formData = new FormData();
    setUserPhoto(e.target.files[0]);
    formData.append('userfile', e.target.files[0]);

    axios
      .post('/haru/user/uploadfile', formData)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    findUserProfile();
  }, [userPhoto]);

  return (
    <div className="div-Form" >
      <Form onSubmit={handlerSubmit}>
        <FormGroup>
          <Label for="exampleFile">프로필사진 변경 하기</Label>
          <div>
             {userPhoto === "/assets/upUserimages/Default.png" ?
                        <Image style={{ width: '150px', height: '150px' }} src={`${DefaultImage}`} roundedCircle /> :  
                        <Image style={{ width: '150px', height: '150px' }} src={`/haru${userPhoto}`} roundedCircle />
            }
          </div>
          <Input type="file" onChange={ImgChange} />
        </FormGroup>
        <FormGroup>
          <Label for="exampleName">이름</Label>
          <Input
            type="text"
            name="name"
            id="exampleName"
            placeholder="이름"
            onChange={ChangeUserName}
            value={userName}
          />
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail">현재사용중인 이메일</Label>
          <Input plaintext onChange={CheckedEmail} value={userEmail} readOnly/>
        </FormGroup>
        <FormGroup>
          <Label for="exampleName">직함</Label>
          <Input type="text" name="title" id="title" placeholder="직함" onChange={ChangeUserdept} value={userdept} />
        </FormGroup>
        <FormGroup>
          <Label for="exampleName">부서</Label>
          <Input type="text" name="dept" id="dept" placeholder="부서" onChange={ChangeUsertitle} value={usertitle} />
        </FormGroup>
        <Button color="primary">Save</Button>
      </Form>
    </div>
  );
};

export default ProfileDetail;
