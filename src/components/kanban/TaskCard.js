import React, { useContext, useEffect,useRef } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import {
  Card,
  CardBody,
  Badge,
  CardImg,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledTooltip
} from 'reactstrap';


import SockJsClient from 'react-stomp';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppContext, { KanbanContext } from '../../context/Context';
import { API_URL, localIp } from '../../config';
import { backgroundColor } from 'echarts/lib/theme/dark';
import axios from 'axios';

const TaskCard = ({ taskCardItemId, taskCard, taskCardImage, members, taskCardIndex }) => {
  const { kanbanColumns, kanbanColumnsDispatch, kanbanTaskCardsDispatch } = useContext(KanbanContext);
  const { projectNo, projectTitle } = useContext(AppContext);
  // 알림 떴는지 안떳는지의 상태
  const { loading, notifications, setNotifications } = useContext(AppContext);
  // 알림을 읽었는지 않있었는지에 대한 상태
  const { isAllRead, setIsAllRead } = useContext(AppContext);

  let clientRef = useRef(null);

  const taskCardDelete = async () => {

    try {
      const json = {
        projectNo: projectNo,
        projectTitle: projectTitle,
        taskCardItemId: taskCardItemId
      }
  
      const response = await fetch(`/haru/api/task/delete`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
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
  
      kanbanTaskCardsDispatch({
        type: 'REMOVE',
        id: taskCardItemId,
        isCard: true
      });
  
      kanbanColumnsDispatch({
        type: 'TASKREMOVE',
        id: taskCardItemId
      });
    } catch(err) {
      console.error(err);
    }

    
  };

  const socketCallback = (socketData) => {
    console.log("asdsad", socketData);

    kanbanTaskCardsDispatch({
      type: 'REMOVE',
      id: socketData.data,
      isCard: true
    });

    kanbanColumnsDispatch({
      type: 'TASKREMOVE',
      id: socketData.data
    });
  }

  const tempStyle = {
    display: 'inline-block',
    margin: '5px'
  };

  const label = {
    borderLeft: `4px solid ${taskCard.taskLabel}`
  };

  const { getItemStyle, setModalContent, setModal } = useContext(KanbanContext);

  return (
    <Draggable draggableId={`draggableId${taskCardItemId}`} index={taskCardIndex}>
      {(provided, snapshot) => (

        <div
          className="kanban-item"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
        >
          <SockJsClient
            url={`${API_URL}/haru/socket`}
            topics={[`/topic/kanban/task/delete/${window.sessionStorage.getItem('authUserNo')}`]}
            onMessage={socketData => {
              socketCallback(socketData);
            }}
            ref={client => {
              clientRef = client;
            }}
          />
          <Card
            className="kanban-item-card hover-actions-trigger "
            style={getItemStyle(snapshot.isDragging)}
            onClick={() => {
              setModalContent({ taskCard, taskCardImage });
              console.log(taskCard);
              setModal(true);
            }}
          >
            {/* {taskCardImage && (
              <CardImg
                top
                width="100%"
                src={taskCardImage.url}
                className="overflow-hidden position-relative"
                alt="Card image cap"
              />
            )} */}

            <CardBody style={label}>
              {taskCard.taskLabel && (
                <div className="mb-2">
                  {taskCard.tagListVo &&
                    taskCard.tagListVo.map((tagListVo, index) => (
                      <Badge
                        className={`d-inline-block py-1 mr-1 mb-1`}
                        style={{ color: '#FFFFFF', backgroundColor: tagListVo.tagColor }}
                        key={index}
                      >
                        {tagListVo.tagName}
                      </Badge>
                    ))}
                </div>
              )}
              <h5>{taskCard.taskName}</h5>
              <p
                className="mb-0 font-weight-medium text-sans-serif"
                dangerouslySetInnerHTML={{ __html: taskCard.taskContents }}
              />
              <div className="kanban-item-footer">
                <div className="text-500" style={{}} />
                <div>{taskCard.taskWriter}</div>
              </div>
              {/* {(taskCard.members || taskCard.attachments || taskCard.checklist) && (
                <div className="kanban-item-footer">
                  <div className="text-500">
                    {taskCard.members && members.find(member => member.id === 1) && (
                      <>
                        <FontAwesomeIcon icon="eye" className="mr-2" id={`cardId-${taskCard.taskNo}`} transform="grow-1" />
                        <UncontrolledTooltip target={`cardId-${taskCard.taskNo}`}>
                          You're assigned in this card
                        </UncontrolledTooltip>
                      </>
                    )}
                    {taskCard.attachments && (
                      <span id={`attachments-${taskCard.id}`} className="mr-2">
                        <FontAwesomeIcon icon="paperclip" className="mr-1" />
                        <span>{taskCard.attachments.length}</span>
                        <UncontrolledTooltip target={`attachments-${taskCard.id}`}>Attachments</UncontrolledTooltip>
                      </span>
                    )}
                    {taskCard.checklist && (
                      <span id={`Checklist-${taskCard.id}`}>
                        <FontAwesomeIcon icon="check" className="mr-1" />
                        <span>
                          {taskCard.checklist.completed}/{taskCard.checklist.totalCount}
                        </span>
                        <UncontrolledTooltip target={`Checklist-${taskCard.id}`}>Checklist</UncontrolledTooltip>
                      </span>
                    )}
                  </div>
                  <div>
                    {taskCard.members &&
                      members.map((member, index) => (
                        <Link
                          to="#!"
                          className={index > 0 ? 'ml-n1 p-0' : 'p-0'}
                          key={index}
                          id={`member-${member.id}-${taskCard.id}`}
                        >
                          <Avatar src={member.avatar.src} size="l" />
                          <UncontrolledTooltip target={`member-${member.id}-${taskCard.id}`}>
                            {member.name}
                          </UncontrolledTooltip>
                        </Link>
                      ))}
                  </div>
                </div>
              )} */}

              <UncontrolledDropdown
                className="position-absolute text-sans-serif t-0 r-0 mt-card mr-card hover-actions"
                onClick={e => {
                  e.stopPropagation();
                  taskCardDelete();
                }}
              >
                <DropdownToggle color="falcon-default" size="sm" className="py-0 px-2">
                  <FontAwesomeIcon icon="trash-alt" />
                </DropdownToggle>
                {/* <DropdownMenu right className="py-0">
                  <DropdownItem>Add Card</DropdownItem>
                  <DropdownItem>Edit</DropdownItem>
                  <DropdownItem>Copy link</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem className="text-danger">Remove</DropdownItem>
                </DropdownMenu> */}
              </UncontrolledDropdown>
            </CardBody>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
