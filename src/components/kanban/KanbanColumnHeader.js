import React, { useContext } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { API_URL, GCP_API_URL, localIp } from '../../config';
import AppContext, { KanbanContext } from '../../context/Context';
import SockJsClient from 'react-stomp';


const KanbanColumnHeder = ({ kanbanColumnItem }) => {
  const { kanbanColumnsDispatch } = useContext(KanbanContext);
  let clientRef = null;
  const {projectNo, projectTitle} = useContext(AppContext);

  const removeClick = async (item) => {

    const json = {
      projectNo : projectNo,
      projectTitle : projectTitle,
      taskListNo: item.taskListNo
    }

    try {
      const response = await fetch(`/haru/api/tasklist/delete`, {
        method: 'post',
        headers: {
          "Content-Type": 'application/json',
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
    
      kanbanColumnsDispatch({
        type: 'REMOVE',
        id: item.taskListNo
      });
    } catch (err) {
      console.error(err);
    }
  }

  const socketCallback = (socketData) => {
    console.log(socketData.data);

    kanbanColumnsDispatch({
      type: 'REMOVE',
      id: socketData.data
    });
  }

  return (
    <div className="kanban-column-header">
      <SockJsClient
          url={`${GCP_API_URL}/haru/socket`}
          topics={[`/topic/kanban/tasklist/remove/${window.sessionStorage.getItem("authUserNo")}`]}
          onMessage={socketData => {socketCallback(socketData)}}
          ref={(client) => {
            clientRef = client
          }}
      />
      <h5 className="text-serif fs-0 mb-0">
        {kanbanColumnItem.taskListName} <span className="text-500">({kanbanColumnItem.taskVoList ? kanbanColumnItem.taskVoList.length : 0})</span>
      </h5>
      <UncontrolledDropdown className="text-sans-serif btn-reveal-trigger">
        
        <DropdownToggle color="reveal" size="sm" className="py-0 px-2">
          <FontAwesomeIcon icon="ellipsis-h" />
        </DropdownToggle>
        <DropdownMenu right className="py-0">
          {/* <DropdownItem>Add Card</DropdownItem>
          <DropdownItem>Edit</DropdownItem>
          <DropdownItem>Copy link</DropdownItem>
          <DropdownItem divider /> */}
          <DropdownItem className="text-danger" onClick={() => removeClick(kanbanColumnItem)}>Remove</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
};

export default KanbanColumnHeder;
