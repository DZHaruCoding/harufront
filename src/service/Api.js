import axios from 'axios';
import moment from 'moment';

const API_URL = 'http://localhost:8080/haru';
const API_HEADERS = { 'Content-Type': 'application/json' };

export function ApiHistory() {
  function fetchInsertHistory(senderNo, senderName, receiver, historyType, actionName, projectNo, clientRef) {
    let userArray = []; //받는사람들
    receiver.map(user => userArray.push(user.userNo)); //receiver 에서 userArray에 하나씩 넣어준다.

    const historyData = {
      senderNo: senderNo, // 보내는사람 한명
      senderName: senderName,
      receiver: userArray, // 받는사람 여러명
      historyType: historyType,
      historyDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      actionName: actionName, // 행위
      projectNo: projectNo,
      authUserNo: sessionStorage.getItem('authUserNo')
    };

    clientRef.sendMessage('/app/history/all', JSON.stringify(historyData));

    return axios.post(
      `${API_URL}/api/history/insertHistory`,
      { headers: API_HEADERS },
      { body: JSON.stringify(historyData) }
    );
  }
}
export function fetchHistory(projectNo) {
  return axios.get(`/haru/api/history/${projectNo}`);
}
export function fetchFile(projectNo) {
  return axios.get(`/haru/api/dashboard/${projectNo}/file`);
}
