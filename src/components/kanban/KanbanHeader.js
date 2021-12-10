import React from 'react';
import { Row, Col, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import GroupMember from './GroupMember';
import users from '../../data/dashboard/users';
import InviteToBoard from './InviteToBoard';
import ButtonIcon from '../common/ButtonIcon';
import { Link } from 'react-router-dom';
const KanbanHeader = () => {
  return (
    <Row noGutters className="bg-100 rounded-soft px-card py-2 mt-2 mb-3 ">
      <Col className="d-flex align-items-center">
        <h5 className="mb-0">HARU</h5>
        {/* <Button color="falcon-default" size="sm" className="ml-3">
          <FontAwesomeIcon icon={['far', 'star']} />
        </Button> */}
        <div className="vertical-line vertical-line-400 position-relative h-100 mx-3" />
        <GroupMember avatarSize="l" showMembers={4} users={users} className="d-none d-md-flex" />
        <div className="vertical-line vertical-line-400 position-relative h-100 mx-3 d-none d-md-flex" />
        <InviteToBoard />
        <div className="vertical-line vertical-line-400 position-relative h-100 mx-3" />
        <ButtonIcon icon="chevron-left" color="info" size="sm-2" className="border-300" tag={Link} to="/kanban">
          KANBAN CHART
        </ButtonIcon>
        <div className="vertical-line vertical-line-400 position-relative h-100 mx-3" />
        <ButtonIcon icon="chevron-left" color="info" size="sm-2" className="border-300" tag={Link} to="/filelist">
          FILE LIST
        </ButtonIcon>
        <div className="vertical-line vertical-line-400 position-relative h-100 mx-3" />
        <ButtonIcon icon="chevron-left" color="info" size="sm-2" className="border-300" tag={Link} to="/activity">
          HISTORY
        </ButtonIcon>
        <div className="vertical-line vertical-line-400 position-relative h-100 mx-3" />
      </Col>
      <Col xs="auto" className="d-flex">
        <Button color="falcon-default" size="sm" className="mr-2 d-none d-md-block">
          <FontAwesomeIcon icon="plus" className="mr-2" />
          Add Column
        </Button>

        <UncontrolledDropdown className="text-sans-serif ">
          <DropdownToggle color="falcon-default" size="sm">
            <FontAwesomeIcon icon="ellipsis-h" />
          </DropdownToggle>
          <DropdownMenu right className="border py-0">
            <div className="bg-white py-2">
              <DropdownItem>Copy link</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Settings</DropdownItem>
              <DropdownItem>Themes</DropdownItem>
              <DropdownItem divider />
              <DropdownItem className="text-danger">Remove</DropdownItem>
            </div>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Col>
    </Row>
  );
};

export default KanbanHeader;
