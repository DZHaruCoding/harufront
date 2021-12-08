import React, { useContext } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { localIp } from '../../config';
import { KanbanContext } from '../../context/Context';


const KanbanColumnHeder = ({ kanbanColumnItem }) => {
  const { kanbanColumnsDispatch } = useContext(KanbanContext);


  const removeClick = async (item) => {

    const response = await fetch(`${localIp}/api/tasklist/delete`, {
      method: 'post',
      headers: {
        "Content-Type": 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(item.taskListNo)
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
  }

  return (
    <div className="kanban-column-header">
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
