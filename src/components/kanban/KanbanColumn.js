import React, { useContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import KanbanColumnHeder from './KanbanColumnHeader';
import { KanbanContext } from '../../context/Context';
import { Droppable } from 'react-beautiful-dnd';

import AddAnotherCard from './AddAnotherCard';
import users from '../../data/dashboard/users';
import ButtonIcon from '../common/ButtonIcon';
import TaskCard from './TaskCard';
import SockJsClient from 'react-stomp';
import { API_URL, GCP_API_URL } from '../../config';

const KanbanColumn = ({ kanbanColumnItem, index }) => {
  const { kanbanTaskCards, kanbanTaskCardsDispatch, kanbanColumnsDispatch } = useContext(KanbanContext);
  const [showForm, setShowForm] = useState(false);
  const $websocket = useRef (null);

  useEffect(() => {
    const kanbanContainer = document.getElementById(`container-${index}`);
    kanbanContainer.scrollTop = kanbanContainer.scrollHeight;
  }, [showForm, index]);

  const socketCallback = e => {
    console.log("asdsadsad", e);

    kanbanTaskCardsDispatch({
      type: 'ADD',
      payload: e.taskVoList,
      id: e.taskVoList.taskNo,
      isCard: true
    });

    kanbanColumnsDispatch({
      type: 'EDIT',
      payload: { ...e.kanbanColumnItem, taskVoList: [...e.kanbanColumnItem.taskVoList, e.taskVoList] },
      id: e.kanbanColumnItem.taskListNo
    });
}

  return (
    <div className={classNames('kanban-column', { 'form-added': showForm })}>
      <SockJsClient
          url={`${GCP_API_URL}/haru/socket`}
          topics={[`/topic/kanban/task/add/${window.sessionStorage.getItem("authUserNo")}`]}
          onMessage={socketData => {socketCallback(socketData)}}
          ref={$websocket}
      />    
      <KanbanColumnHeder kanbanColumnItem={kanbanColumnItem} />
      <Droppable droppableId={`${kanbanColumnItem.taskListNo}`}>
        {(provided, snapshot) => (
          <>
            <div
              className="kanban-items-container scrollbar"
              id={`container-${index}`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {kanbanColumnItem.taskVoList &&
                kanbanColumnItem.taskVoList.map((taskCardItemId, taskCardIndex) => {
                  // const taskCard = kanbanTaskCards.find(({ id }) => id === taskCardItemId);
                  const taskCard = taskCardItemId;
                  // const taskCardImage = taskCard.attachments && taskCard.attachments.find(({ type }) => type === 'image');

                  const members =
                    taskCard.members &&
                    taskCard.members.map(member => {
                      return users.find(user => member === user.id);
                    });

                  // const members = '';

                  return (
                    <TaskCard
                      // members={members}
                      // taskCardImage={taskCardImage}
                      taskCard={taskCard}
                      key={taskCardItemId.taskNo}
                      taskCardIndex={taskCardIndex}
                      taskCardItemId={taskCardItemId.taskNo}
                    />
                  );
                })}
              {showForm && <AddAnotherCard kanbanColumnItem={kanbanColumnItem} setShowForm={setShowForm} websocket={$websocket} />}
              {provided.placeholder}
            </div>
            {!showForm && (
              <div className="kanban-column-footer">
                <ButtonIcon
                  className="btn-add-card text-600 text-decoration-none"
                  color="link"
                  block
                  icon="plus"
                  iconClassName="mr-1"
                  size="sm"
                  onClick={() => {
                    setShowForm(true);
                  }}
                >
                  Add another card
                </ButtonIcon>
              </div>
            )}
          </>
        )}
      </Droppable>
    </div>
  );
};
KanbanColumn.propTypes = {
  kanbanColumnItem: PropTypes.object.isRequired
};
export default KanbanColumn;
