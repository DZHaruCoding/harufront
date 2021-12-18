import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
const SettingDetail = () => {
    const [nowPassword, setNowPassword] = useState("");
    const [changedPassword, setChangedPassword] = useState("");
    const [ckPassword, setCkPassword] = useState("");

    const [passwordMessage, setPasswordMessage] = useState('')
    const [isPassword, setIsPassword] = useState(false)

    const [ckpasswordMessage, setCkPasswordMessage] = useState("");
    const [isCkPassword, setIsCkPassword] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    
    const [NowPasswordMessage, setNowPasswordMessage] = useState("");
    const [isNowPassword, setIsNowPassword] = useState(false);
    const handlerSubmit = async e => {

        const userPassword = {
            userPassword : nowPassword
        }
        try {
            const response = await fetch("/haru/user/checkPassword", {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(userPassword)
            })

            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`)
            }

            const json = await response.json();
            console.log(json);

            console.log(json.data);
            if (json.result !== 'success') {
                throw json.message;
            }

            if (json.data) {
                setIsNowPassword(true)
                setNowPasswordMessage("비밀번호가 일치하지 않습니다");
            }

        } catch (err) {
            console.log(err);
        }

       

    }

    const onChangePassword = e => {
        setChangedPassword(e.target.value);
        console.log(changedPassword)
        setIsPassword(true);
        const passwords = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/
        if (!passwords.test(changedPassword)) {
            setPasswordMessage('특수문자, 문자, 숫자를 포함한 8~15 자리 이상이여야 합니다');
            setIsPassword(false);
        } else {
            setPasswordMessage("안전한 비밀번호 입니다");
            setIsPassword(true)
        }
    };

    const onChangeCkPoassword = e => {
        setCkPassword(e.target.value);
        setIsCkPassword(true)
        console.log(changedPassword)
        console.log(ckPassword)
        if (ckPassword === changedPassword) {
            setCkPasswordMessage("변경할 비밀번호가 동일합니다")
            setIsCkPassword(true)
        } else {
            setCkPasswordMessage("변경할 비밀번호가 동일하지 않습니다")
            setIsCkPassword(false)
        }
    }

    useEffect(() => {
        setIsDisabled(!isCkPassword || !isPassword);
      }, [isPassword, isCkPassword]);


    return (
        <div>
            <Form onSubmit={handlerSubmit}>
                <FormGroup>
                    <Label for="examplePassword">비밀번호 변경</Label>
                    <br />
                    <Label>현제 비밀번호를 입력해주세요</Label>
                    <Input
                        type="password"
                        name="now-password"
                        id="examplePassword"
                        placeholder="현제 비밀번호"
                        value={nowPassword}
                        onChange={(e) => setNowPassword(e.target.value)} />
                    <br />
                    {(<span className={`message ${isNowPassword ? 'success' : 'error'}`}>{NowPasswordMessage}</span>)}
                    <Label>변경할 비밀번호를 입력해주요</Label>
                    <Input
                        type="password"
                        name="change-Password"
                        id="examplePassword"
                        placeholder="변경할 비밀번호"
                        value={changedPassword}
                        onChange={onChangePassword} />
                    {nowPassword.length > 0 && (<span className={`message ${isPassword ? 'success' : 'error'}`}>{passwordMessage}</span>)}
                    <br />
                    <Label>변경한 이메일을 확인 합니다</Label>
                    <Input
                        type="password"
                        name="change-check-password"
                        id="examplePassword"
                        placeholder="변경할 비밀번호 확인"
                        value={ckPassword}
                        onChange={onChangeCkPoassword} />
                    <br />
                    {ckPassword.length > 0 && (<span className={`message ${isCkPassword ? 'success' : 'error'}`}>{ckpasswordMessage}</span>)}
                </FormGroup>
                <Button color="primary" disabled={isDisabled}>Save</Button>
            </Form>
            <br /><br />
            <Form>
                <FormGroup>
                    <Label for="examplePassword">계정 탈퇴하기</Label>
                    <br />
                    <Button color="primary">Save</Button>
                </FormGroup>
            </Form>
        </div>
    );
};

export default SettingDetail;