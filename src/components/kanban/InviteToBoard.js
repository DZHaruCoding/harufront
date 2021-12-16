import React, { useContext, useRef, useState } from 'react';
import { Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Tooltip } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { copyToClipBoard } from '../../helpers/utils';
import Flex from '../common/Flex';
import AppContext from '../../context/Context';
import { toast } from 'react-toastify';

const InviteToBoard = () => {
  const [tooltipText, setTooltipText] = useState('Copy link to invite');
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const tooltipRef = useRef(null);
  const copyTextRef = useRef(null);
  const {projectNo, projectTitle} = useContext(AppContext);
  const [userEmail, setUserEmail] = useState();

  const toggle = () => setTooltipOpen(!tooltipOpen);

  const handleClickTooltip = () => {
    copyToClipBoard(copyTextRef);
    setTooltipText('Copied to clipboard');
    setTooltipOpen(true);
  };

  const emailOnChange = (e) => {
    setUserEmail(e.target.value);
  }

  const memberInvite = async () => {

    console.log(userEmail);

    const json = {
      userEmail: userEmail
    }
    try {
      const response = await fetch(`/haru/api/tasklist/member/invite/${projectNo}`, {
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
        toast.success(jsonResult.message);
        return;
        
      }

      toast.success("맴버 추가 완료했습니다.");

    } catch(err) {
      console.log(err.message);
    }
    


  };

  return (
    <UncontrolledDropdown size="sm">
      <DropdownToggle color="falcon-default">
        <FontAwesomeIcon icon="plus" className="mr-1" /> Invite
      </DropdownToggle>
      <DropdownMenu className="pt-2 pb-0 text-nowrap" right>
        <DropdownItem header className="text-center">
          Invite To Board
        </DropdownItem>
        <DropdownItem divider className="mb-0" />
        <div className="p-3">
          <form
            onSubmit={e => {
              e.preventDefault();
              memberInvite();
            }}
          >
            <div className="border rounded fs--2 mb-3">
              <Flex className="border-bottom bg-200 flex-between-center">
                <div className="px-2">Anyone with the link can join</div>
                <div className="border-left">
                  <Button
                    id="copyTextTooltip"
                    color="link"
                    className="text-decoration-none hover-300 rounded-0 fs--2"
                    size="sm"
                    onClick={handleClickTooltip}
                  >
                    <FontAwesomeIcon icon={['far', 'copy']} className="mr-2" />
                    Copy link
                    <Tooltip
                      innerRef={tooltipRef}
                      placement="top"
                      target="copyTextTooltip"
                      isOpen={tooltipOpen}
                      toggle={toggle}
                    >
                      {tooltipText}
                    </Tooltip>
                  </Button>
                </div>
              </Flex>
              <Input
                className="bg-white border-0 fs--2 px-1"
                id="copyText"
                innerRef={copyTextRef}
                readOnly
                value={`http://localhost:3000/haru/api/member/invite/${projectNo}`}
              />
            </div>
            <Input bsSize="sm" placeholder="Enter name or email"  onChange={emailOnChange}/>

            <Button color="primary" size="sm" block type="submit" className="mt-2">
              Send Invitation
            </Button>
          </form>
        </div>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default InviteToBoard;
