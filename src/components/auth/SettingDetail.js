import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import Modal from 'react-modal';
import withRedirect from '../../hoc/withRedirect';
import UserDeledModal from './UserDeledModal';
import modalStyles from '../../assets/scss/Modal.scss'
import styles from '../../assets/scss/SettingDetails.scss';


Modal.setAppElement('body');

const SettingDetail = ({ setRedirect, setRedirectUrl, layout}) => {
    const [password, setPassword] = useState("");
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


    // 모달 상태값
    const [isOpenModal, setIsOpenModal] = useState(false);


    const handlerSubmit = async e => {

        e.preventDefault();

        const userPassword = {
            userPassword: nowPassword,
            updatePassword: ckPassword
        }

        console.log("전송할 비밀번호 데이터 : " + userPassword)

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
                console.log("비밀번호 일치함")
            } else {
                setIsNowPassword(false)
                setNowPasswordMessage("비밀번호가 일치하지 않습니다")
            }
        

        } catch (err) {
            console.log(err);
        }



        setRedirect(true);
    }
    
    // 계정 탈퇴시 사용하는 핸들러 함수
    // const handleSubmitModal = async (e) => {
    //     e.preventDefault();
    //     try {
    //         if (e.target.password.value === '') {
    //             setModalData(Object.assign({}, modalData, {
    //                 label: '비밀번호를 입력해주세요.',
    //                 password: ''
    //             }));
    //             return;
    //         }

    //         console.log(modalData.messageNo, e.target.password.value)

    //         const response = await fetch(`/haru/user/deleteUser`, {
    //             method: 'post',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Accept': 'application/json'
    //             },
    //             body: JSON.stringify({ userPassword: e.target.password.value })
    //         });

    //         if (!response.ok) {
    //             throw `${response.status} ${response.statusText}`;
    //         }

    //         const json = await response.json();
    //         console.log(json)

    //         // 비밀번호가 틀린 경우
    //         if (json.data === false) {
    //             setModalData(Object.assign({}, modalData, {
    //                 label: '비밀번호가 일치하지 않습니다.',
    //                 password: ''
    //             }));
    //             return;
    //         }

    //         setModalData({
    //             isOpen: false,
    //             password: ''
    //         });

    //     } catch (err) {
    //         console.error(err);
    //     }
    // }

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
        // setIsCkPassword(true)
        console.log(changedPassword)
        console.log(ckPassword)
        if (e.target.value === changedPassword) {
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

    useEffect(() => {
        setRedirectUrl(`/authentication/basic/change-password`);
    }, [setRedirectUrl, layout]);
    return (
        <Fragment>

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
                    {(<span className={`message ${isNowPassword ? 'success' : 'error'}`}>{NowPasswordMessage}</span>)}
                    <br />
                    <Label>변경할 비밀번호를 입력해주세요</Label>
                    <Input
                        type="password"
                        name="change-Password"
                        id="examplePassword"
                        placeholder="변경할 비밀번호"
                        value={changedPassword}
                        onChange={onChangePassword} />
                    {nowPassword.length > 0 && (<span className={`message ${isPassword ? 'success' : 'error'}`}>{passwordMessage}</span>)}
                    <br />
                    <Label>변경한 비밀번호을 확인 합니다</Label>
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
                    <Button color="red" onClick={() => setIsOpenModal(true)}>계정탈퇴</Button>
                </FormGroup>
            </Form>
            {/* <UserDeledModal isOpen={isOpenModal}/> */}
            {/* <div className={modalStyles.modal_container}>
                <Modal
                    isOpen={modalData.isOpen}
                    onRequestClose={() => setModalData({ isOpen: true })}
                    shouldCloseOnOverlayClick={true}
                    className={modalStyles.Modal}
                    overlayClassName={modalStyles.Overlay}
                    style={{ content: { width: 350 } }} >
                    <h1>비밀번호입력</h1>


                    <Form
                        ref={refForm}
                        className={styles.DeleteForm}
                        onSubmit={handleSubmitModal}>
                        <Label>{modalData.label || ''}</Label>
                        <Input
                            type={'password'}
                            autoComplete={'off'}
                            name={'password'}
                            value={modalData.password}
                            placeholder={'비밀번호'}
                            onChange={(e) => setModalData(Object.assign({}, modalData, { password: e.target.value }))} />
                        <br />
                        <div  className={modalStyles['modal-dialog-buttons'] }>
                        <Button >확인</Button>
                        </div>
                        <Button>취소</Button>
                    </Form>
                </Modal>
            </div> */}
        </Fragment>
    );
};

export default withRedirect(SettingDetail);