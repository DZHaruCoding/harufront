import moment from 'moment';
import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { GCP_API_URL } from '../../config';
import AppContext, { KanbanContext } from '../../context/Context';
import { arrayReducer } from '../../reducers/arrayReducer';
import SockJsClient from 'react-stomp';
const KanbanProvider = ({ children, curprojectNo, curmembers, curprojectTitle }) => {
  const [kanbanColumns, kanbanColumnsDispatch] = useReducer(arrayReducer, []);
  const [kanbanTaskCards, kanbanTaskCardsDispatch] = useReducer(arrayReducer, []);
  const [modal, setModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const { projectNo, projectTitle, members, setMembers, activityLogDispatch } = useContext(AppContext);
  const [history, setHistory] = useState([]);
  const $websocket = useRef(null);
  const getItemStyle = isDragging => ({
    // change background colour if dragging
    cursor: isDragging ? 'grabbing' : 'pointer',
    transform: isDragging ? 'rotate(-3deg)' : '',
    transition: 'all 0.3s ease-out'
    // styles we need to apply on draggables
  });

  async function fetchInsertHistory(senderNo, senderName, receiver, historyType, actionName, projectNo, clientRef) {
    //보내는사람,받는사람,받는사람배열,히스토리 타입,엑션이름,프로젝트넘버,
    let userArray = []; //받는사람들
    console.log('user.userNo사람들 누구일까?', receiver);
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
    console.log('히스토리데이터입니다.', historyData);
    clientRef.current.sendMessage('/app/history/all', JSON.stringify(historyData)); //서버로 메세지 전송
    /////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////
    const response = await fetch(`/haru/api/history/insertHistory`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(historyData)
    });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const jsonResult = await response.json();
    const AddArr = jsonResult.data;
    console.log('insertHistory에서의 jsonResult.data', jsonResult.data);
    if (jsonResult.result != 'success') {
      throw new Error(`${jsonResult.result} ${jsonResult.message}`);
    }

    activityLogDispatch({
      type: 'ALADD',
      payload: {
        AddArr
      }
    });

    // fetchinsert();
  }

  useEffect(() => {
    console.log('칸반 멤버,', curmembers);

    const fun = async () => {
      try {
        setMembers(curmembers);
        // ${curprojectNo !== '' ? curprojectNo : projectNo}
        const response = await fetch(`/haru/api/tasklist/data/${curprojectNo !== '' ? curprojectNo : projectNo}`, {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: null
        });

        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }

        const jsonResult = await response.json();

        if (jsonResult.result != 'success') {
          throw new Error(`${jsonResult.result} ${jsonResult.message}`);
        }

        const item = jsonResult;
        kanbanColumnsDispatch({
          type: 'ALLADD',
          payload: {
            ...jsonResult,
            item
          },
          id: 1
        });

        jsonResult.data.map(item =>
          item.taskVoList.map(item2 =>
            kanbanTaskCardsDispatch({
              type: 'ADD',
              payload: item2,
              id: item2.taskNo,
              isCard: true
            })
          )
        );
      } catch (err) {
        console.log(err);
      }
    };

    fun();
  }, []);

  const kanbanAllAdd = column => {
    const item = column;
    kanbanColumnsDispatch({
      type: 'ALLADD',
      payload: {
        ...column,
        item
      },
      id: 1
    });
  };

  const UpdateColumnData2 = (column, taskVoList) => {
    kanbanColumnsDispatch({
      type: 'EDIT',
      payload: {
        ...column,
        taskVoList
      },
      id: column.taskListNo
    });
  };

  const UpdateColumnData = async (column, taskVoList) => {
    kanbanColumnsDispatch({
      type: 'EDIT',
      payload: {
        ...column,
        taskVoList
      },
      id: column.taskListNo
    });

    try {
      const requestData = taskVoList;
      const json = {
        taskListNo: column.taskListNo,
        taskVoList: requestData,
        projectNo: projectNo,
        projectTitle: projectTitle,
        updateTaskList: column
      };

      const response = await fetch(`/haru/api/task/dropTask`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(json)
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const jsonResult = await response.json();

      if (jsonResult.result != 'success') {
        throw new Error(`${jsonResult.result} ${jsonResult.message}`);
      }

      console.log('요청 완료');

      return 'true';
    } catch (err) {
      console.error(err);
      return 'fail';
    }
  };

  const value = {
    $websocket,
    fetchInsertHistory,
    kanbanTaskCards,
    history,
    setHistory,
    members,
    kanbanTaskCardsDispatch,
    kanbanColumns,
    kanbanColumnsDispatch,
    getItemStyle,
    UpdateColumnData,
    UpdateColumnData2,
    kanbanAllAdd,
    modalContent,
    setModalContent,
    modal,
    setModal
  };
  return (
    <>
      <SockJsClient
        // url={`${GCP_API_URL}/haru/socket`}
        url={`${GCP_API_URL}/haru/socket`}
        topics={[``]}
        onMessage={sock => {}}
        ref={$websocket}
      />
      <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>;
    </>
  );
};

export default KanbanProvider;
