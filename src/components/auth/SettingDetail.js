import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Button, Form, FormGroup, Input, Label,Modal } from 'reactstrap';
// import Modal from 'react-modal';
import withRedirect from '../../hoc/withRedirect';
import UserDeledModal from './UserDeledModal';
import modalStyles from '../../assets/scss/Modal.scss'
import styles from '../../assets/scss/SettingDetails.scss';
import styless from './modal.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBell, faCheckCircle, faTimesCircle, faAt, faCog, faTimes, faPlus} from '@fortawesome/free-solid-svg-icons';


// Modal.setAppElement('body');

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

    const [modalData,setModalData] = useState({isOpen: false});
    const refForm = useRef(null);

    const [userState, isUserStata] = useState(true);

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

            if (json.result !== 'success') {
                throw json.message;
            }

            console.log(json.data)

            if (json.data) {
                setIsNowPassword(true)
                setRedirect(true);
            } else {
                setIsNowPassword(false)
                setNowPasswordMessage("비밀번호가 일치하지 않습니다")
            }
        

        } catch (err) {
            console.log(err);
        }



    }

    
    // 계정 탈퇴시 사용하는 핸들러 함수
    const handleSubmitModal = async (e) => {
        e.preventDefault();
        try {
            if (e.target.password.value === '') {
                setModalData(Object.assign({}, modalData, {
                    label: '비밀번호를 입력해주세요.',
                    password: ''
                }));
                return;
            }

            console.log(modalData.messageNo, e.target.password.value)

            const response = await fetch(`/haru/user/deleteUser`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ userPassword: e.target.password.value })
            });

            if (!response.ok) {
                throw `${response.status} ${response.statusText}`;
            }

            const json = await response.json();

            // 비밀번호가 틀린 경우
            if (json.data === false) {
                setModalData(Object.assign({}, modalData, {
                    label: '비밀번호가 일치하지 않습니다.',
                    password: ''
                }));
                return;
            }

            setModalData({
                password: ''
            });
            setIsOpenModal(false)
        } catch (err) {
            console.error(err);
        }

        sessionStorage.clear();
        isUserStata(false);
        setRedirect(true);

    }

    const onChangePassword = e => {
        setChangedPassword(e.target.value);
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
        if (e.target.value === changedPassword) {
            setCkPasswordMessage("변경할 비밀번호가 동일합니다")
            setIsCkPassword(true)
        } else {
            setCkPasswordMessage("변경할 비밀번호가 동일하지 않습니다")
            setIsCkPassword(false)
        }
    }

    useEffect(()=> {
        setRedirectUrl(`/authentication/basic/delete-user`)
    },[userState])

    useEffect(() => {
        setIsDisabled(!isCkPassword || !isPassword);
    }, [isPassword, isCkPassword]);

    useEffect(() => {
        setRedirectUrl(`/authentication/basic/change-password`);
    }, [setRedirectUrl, layout]);

    const btnclick = () =>{
        setIsOpenModal(false);
    }
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
                    <Button style={{color:"red",backgroundColor:"#EDF2F9",border:"0px"}}  onClick={() => setIsOpenModal(true)}>계정탈퇴</Button>
                </FormGroup>
            </Form>

            {/* <UserDeledModal isOpen={isOpenModal}/> */}
                <Modal
                    isOpen={isOpenModal}
                    onRequestClose={() => setModalData({ isOpen: true })}
                    shouldCloseOnOverlayClick={true}
                    className={ styless.Modal }
                    overlayClassName={ styless.Overlay } 
                  >
                <div style={{padding:"10px"}}>
                    <div style={{display:"flex", justifyContent:'space-between'}}>
                    <h1>비밀번호 입력</h1>
                    <Button style={{backgroundColor:"white", border:"0px", marginTop:"-5px"}} onClick={ () => { btnclick() }}><FontAwesomeIcon style={{color:"gray"}} icon={faTimes}/></Button>
                    </div>

                    <Form
                        ref={refForm}
                        className={styles.DeleteForm}
                        onSubmit={handleSubmitModal}
                        // style={{position:}}
                        >
                        <Label>{modalData.label || ''}</Label>
                        <Input
                            type={'password'}
                            autoComplete={'off'}
                            name={'password'}
                            value={modalData.password}
                            placeholder={'비밀번호'}
                            onChange={(e) => setModalData(Object.assign({}, modalData, { password: e.target.value }))} />
                        <br />
                        <div style={{display:"flex", justifyContent:"end"}}>
                            <div  className={modalStyles['modal-dialog-buttons'] }>
                                <Button style={{backgroundColor:"white", color:"black"}} >확인</Button>
                            </div>
                               <Button style={{marginLeft:"10px",backgroundColor:"white", color:"black"}} onClick={ () => {btnclick() }}>취소</Button>
                        </div>
                    </Form>
                </div>    
                </Modal>
        </Fragment>
    );
};

export default withRedirect(SettingDetail);