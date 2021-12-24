import moment from 'moment';
import React, { useContext, useEffect, useRef } from 'react';
import SockJsClient from 'react-stomp';
import { GCP_API_URL } from '../../config';
import AppContext, { ActivityContext } from '../../context/Context';

const ActivityProvider = ({ children }) => {
  const { projectNo, activityLog, activityLogDispatch } = useContext(AppContext);
  const $websocket = useRef(null);

  const receiveHistory = socketData => {
    console.log('socketData소켓데이터입니다.ㅏ아앙', socketData);
    if (socketData.authUserNo !== sessionStorage.getItem('authUserNo')) {
      if (socketData.historyType === 'taskContentsUpdate') {
        let newHistoryData = {
          logContents: socketData.senderName + ' 님이' + socketData.actionName + ' 으로 업무이름을 수정하셨습니다.',
          logDate: socketData.historyDate,
          projectNo: socketData.projectNo
        };
        activityLogDispatch({ type: 'HISADD', payload: newHistoryData });
      } else if (socketData.historyType === 'taskListInsert') {
        let newHistoryData = {
          logContents: socketData.senderName + ' 님이' + socketData.actionName + ' 업무리스트를 추가하였습니다.',
          logDate: socketData.historyDate,
          projectNo: socketData.projectNo
        };
        activityLogDispatch({ type: 'HISADD', payload: newHistoryData });
      } else if (socketData.historyType === 'taskListDelete') {
        let newHistoryData = {
          logContents: socketData.senderName + ' 님이' + socketData.actionName + ' 업무리스트를 삭제하였습니다.',
          logDate: socketData.historyDate,
          projectNo: socketData.projectNo
        };
        activityLogDispatch({ type: 'HISADD', payload: newHistoryData });
      } else if (socketData.historyType === 'taskDateUpdate') {
        let newHistoryData = {
          logContents: socketData.senderName + ' 님이' + socketData.actionName + ' 업무의 마감일을 수정하였습니다.',
          logDate: socketData.historyDate,
          projectNo: socketData.projectNo
        };
        activityLogDispatch({ type: 'HISADD', payload: newHistoryData });
      } else if (socketData.historyType === 'checklistInsert') {
        let newHistoryData = {
          logContents: socketData.senderName + ' 님이' + socketData.actionName + ' 업무에 체크리스트를 추가하였습니다.',
          logDate: socketData.historyDate,
          projectNo: socketData.projectNo
        };
        activityLogDispatch({ type: 'HISADD', payload: newHistoryData });
      } else if (socketData.historyType === 'checklistStateUpdate') {
        let newHistoryData = {
          logContents:
            socketData.senderName + ' 님이' + socketData.actionName + ' 업무의 체크리스트 상태를 수정하였습니다.',
          logDate: socketData.historyDate,
          projectNo: socketData.projectNo
        };
        activityLogDispatch({ type: 'HISADD', payload: newHistoryData });
      } else if (socketData.historyType === 'taskDragNdrop') {
        let newHistoryData = {
          logContents: socketData.senderName + ' 님이' + socketData.actionName + ' 업무의 위치를 변경하였습니다.',
          logDate: socketData.historyDate,
          projectNo: socketData.projectNo
        };

        activityLogDispatch({ type: 'HISADD', payload: newHistoryData });
      } else if (socketData.historyType === 'taskListDragNdrop') {
        let newHistoryData = {
          logContents: socketData.senderName + ' 님이' + socketData.actionName + ' 업무리스트의 위치를 변경하였습니다.',
          logDate: socketData.historyDate,
          projectNo: socketData.projectNo
        };
        activityLogDispatch({ type: 'HISADD', payload: newHistoryData });
      } else if (socketData.historyType === 'taskStateUpdate') {
        let newHistoryData = {
          logContents: socketData.senderName + ' 님이' + socketData.actionName + ' 업무 상태를 변경하였습니다.',
          logDate: socketData.historyDate,
          projectNo: socketData.projectNo
        };

        activityLogDispatch({ type: 'HISADD', payload: newHistoryData });
      } else if (socketData.historyType === 'taskInsert') {
        let newHistoryData = {
          logContents: socketData.senderName + ' 님이' + socketData.actionName + ' 업무를 추가하였습니다.',
          logDate: socketData.historyDate,
          projectNo: socketData.projectNo
        };
        activityLogDispatch({ type: 'HISADD', payload: newHistoryData });
      } else if (socketData.historyType === 'taskDelete') {
        let newHistoryData = {
          logContents: socketData.senderName + ' 님이' + socketData.actionName + ' 업무를 삭제하였습니다.',
          logDate: socketData.historyDate,
          projectNo: socketData.projectNo
        };
        activityLogDispatch({ type: 'HISADD', payload: newHistoryData });
      }
    } else {
      return;
    }
    return;
  };

  useEffect(() => {
    const run = async () => {
      try {
        const response = await fetch(`/haru/api/history/${projectNo}`, {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }

        //response 데이터 json으로 변환하기
        const jsonResult = await response.json(); //여기서부터 오류 null값..

        console.log('리스폰스 :', response);
        console.log('제이슨리졸트 :', jsonResult);
        console.log('제이슨리졸트데이터 :', jsonResult.data);

        //통신 했지만 결과값이 success가 아니면
        if (jsonResult.result !== 'success') {
          throw new Error(`${jsonResult.result} ${jsonResult.message}`);
        }
        const AddArr = jsonResult.data;
        activityLogDispatch({
          type: 'ALADD',
          payload: {
            AddArr
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    run();
  }, []);

  const value = {
    projectNo,
    activityLog,
    activityLogDispatch
  };
  return (
    <>
      <SockJsClient
        // url={`${GCP_API_URL}/haru/socket`}
        url={`${GCP_API_URL}/haru/socket`}
        topics={[`/topic/history/all/${window.sessionStorage.getItem('authUserNo')}`]}
        onMessage={sock => {
          console.log('sockjsclient :::: 여기까지 왔니');
          receiveHistory(sock);
        }}
        ref={$websocket}
      />
      <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
    </>
  );
};

export default ActivityProvider;
