import React, { useContext, useRef, useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
// import SockJsClient from 'react-stomp';

const API_URL = 'http://localhost:8080/haru';
const API_HEADERS = { 'Content-Type': 'application/json' };

const { history, setHistory } = useState([]);
let clientRef = useRef(null);

// export function fetchInsertHistory(senderNo, senderName, receiver, historyType, actionName, projectNo, clientRef) {
//   let userArray = []; //받는사람들
//   receiver.map(user => userArray.push(user.userNo)); //receiver 에서 userArray에 하나씩 넣어준다.

// const historyData = {
//   senderNo: senderNo, // 보내는사람 한명
//   senderName: senderName,
//   receiver: userArray, // 받는사람 여러명
//   historyType: historyType,
//   historyDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
//   actionName: actionName, // 행위
//   projectNo: projectNo,
//   authUserNo: sessionStorage.getItem('authUserNo')
// };

//   clientRef.sendMessage('/app/history/all', JSON.stringify(historyData)); //서버로 메세지 전송

//   return axios.post(
//     `${API_URL}/api/history/insertHistory`,
//     { headers: API_HEADERS },
//     { body: JSON.stringify(historyData) }
//   );
// }

/* zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz */
{
  /* <SockJsClient
  url={`${API_URL}/socket`}
  topics={[
    `/topic/all/${sessionStorage.getItem('authUserNo')}`,
    `/topic/history/all/${sessionStorage.getItem('authUserNo')}`
  ]}
  onMessage={receiveHistory}
  ref={client => {
    clientRef = client;
  }}
/>; */
}

export function fetchFile(projectNo) {
  return axios.get(`${localIp}/haru/api/dashboard/${projectNo}/file`);
}

// export function receiveHistory(socketData) {
//   if (socketData.authUserNo !== sessionStorage.getItem('authUserNo')) {
//     if (socketData.historyType === 'taskContentsUpdate') {
//       let newHistoryData = {
//         logContents: socketData.senderName + ' 님이' + socketData.actionName + ' 으로 업무이름을 수정하셨습니다.',
//         logDate: socketData.historyDate,
//         projectNo: socketData.projectNo
//       };
//       setHistory(newHistoryData);
//     } else if (socketData.historyType === 'taskListInsert') {
//       let newHistoryData = {
//         logContents: socketData.senderName + ' 님이' + socketData.actionName + ' 업무리스트를 추가하였습니다.',
//         logDate: socketData.historyDate,
//         projectNo: socketData.projectNo
//       };
//       setHistory(newHistoryData);
//     } else if (socketData.historyType === 'taskListDelete') {
//       let newHistoryData = {
//         logContents: socketData.senderName + ' 님이' + socketData.actionName + ' 업무리스트를 삭제하였습니다.',
//         logDate: socketData.historyDate,
//         projectNo: socketData.projectNo
//       };
//       setHistory(newHistoryData);
//     } else if (socketData.historyType === 'taskDateUpdate') {
//       let newHistoryData = {
//         logContents: socketData.senderName + ' 님이' + socketData.actionName + ' 업무의 마감일을 수정하였습니다.',
//         logDate: socketData.historyDate,
//         projectNo: socketData.projectNo
//       };
//       setHistory(newHistoryData);
//     } else if (socketData.historyType === 'taskMemberJoin') {
//       let newHistoryData = {
//         logContents: socketData.senderName + ' 님이' + socketData.actionName + ' 업무에 멤버를 추가하였습니다.',
//         logDate: socketData.historyDate,
//         projectNo: socketData.projectNo
//       };
//       setHistory(newHistoryData);
//     } else if (socketData.historyType === 'checklistInsert') {
//       let newHistoryData = {
//         logContents: socketData.senderName + ' 님이' + socketData.actionName + ' 업무에 체크리스트를 추가하였습니다.',
//         logDate: socketData.historyDate,
//         projectNo: socketData.projectNo
//       };
//       setHistory(newHistoryData);
//     } else if (socketData.historyType === 'checklistStateUpdate') {
//       let newHistoryData = {
//         logContents:
//           socketData.senderName + ' 님이' + socketData.actionName + ' 업무의 체크리스트 상태를 수정하였습니다.',
//         logDate: socketData.historyDate,
//         projectNo: socketData.projectNo
//       };
//       setHistory(newHistoryData);
//     } else if (socketData.historyType === 'taskDragNdrop') {
//       let newHistoryData = {
//         logContents: socketData.senderName + ' 님이' + socketData.actionName + ' 업무의 위치를 변경하였습니다.',
//         logDate: socketData.historyDate,
//         projectNo: socketData.projectNo
//       };

//       setHistory(newHistoryData);
//     } else if (socketData.historyType === 'taskListDragNdrop') {
//       let newHistoryData = {
//         logContents: socketData.senderName + ' 님이' + socketData.actionName + ' 업무리스트의 위치를 변경하였습니다.',
//         logDate: socketData.historyDate,
//         projectNo: socketData.projectNo
//       };
//       setHistory(newHistoryData);
//     } else if (socketData.historyType === 'taskStateUpdate') {
//       let newHistoryData = {
//         logContents: socketData.senderName + ' 님이' + socketData.actionName + ' 업무 상태를 변경하였습니다.',
//         logDate: socketData.historyDate,
//         projectNo: socketData.projectNo
//       };

//       setHistory(newHistoryData);
//     } else if (socketData.historyType === 'taskInsert') {
//       let newHistoryData = {
//         logContents: socketData.senderName + ' 님이' + socketData.actionName + ' 업무를 추가하였습니다.',
//         logDate: socketData.historyDate,
//         projectNo: socketData.projectNo
//       };
//       setHistory(newHistoryData);
//     } else if (socketData.historyType === 'taskDelete') {
//       let newHistoryData = {
//         logContents: socketData.senderName + ' 님이' + socketData.actionName + ' 업무를 삭제하였습니다.',
//         logDate: socketData.historyDate,
//         projectNo: socketData.projectNo
//       };
//       setHistory(newHistoryData);
//     } else if (socketData.historyType === 'projectMemberJoin') {
//       let newHistoryData = {
//         logContents: socketData.senderName + ' 님이' + socketData.actionName + ' 님을 프로젝트에 참여시켰습니다.',
//         logDate: socketData.historyDate,
//         projectNo: socketData.projectNo
//       };
//       setHistory(newHistoryData);
//     } else if (socketData.historyType === 'projectMemberInvite') {
//       let newHistoryData = {};
//       if (socketData.actionName.memberName == '') {
//         newHistoryData = {
//           logContents:
//             socketData.senderName + ' 님이' + socketData.actionName.memberEmail + ' 님을 프로젝트에 참여시켰습니다.',
//           logDate: socketData.historyDate,
//           projectNo: socketData.projectNo
//         };
//       } else {
//         newHistoryData = {
//           logContents:
//             socketData.senderName + ' 님이' + socketData.actionName.memberName + ' 님을 프로젝트에 참여시켰습니다.',
//           logDate: socketData.historyDate,
//           projectNo: socketData.projectNo
//         };
//       }
//       setHistory(newHistoryData);
//     }
//   } else {
//     return;
//   }
//   return;
// }
