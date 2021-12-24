import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, Dropdown } from 'reactstrap';
import Image from 'react-bootstrap/Image';
import { ProfileContext } from '../../context/Context';
import DefaultImage from '../../assets/img/Default.png';



const ProfileDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prevState => !prevState);
  const {ProfilePhoto, setProfilePhoto} = useContext(ProfileContext);
  
  return (
    <Dropdown
      nav
      inNavbar
      isOpen={dropdownOpen}
      toggle={toggle}
      onMouseOver={() => {
        let windowWidth = window.innerWidth;
        windowWidth > 992 && setDropdownOpen(true);
      }}
      onMouseLeave={() => {
        let windowWidth = window.innerWidth;
        windowWidth > 992 && setDropdownOpen(false);
      }}
    >
      <DropdownToggle nav className="pr-0">
        {/* <Image style={{ width: '40px', height: '40px' }} src={`/haru${ProfilePhoto}`} roundedCircle/> */}
        {ProfilePhoto === "/assets/upUserimages/Default.png" ?
                        <Image style={{ width: '30px', height: '30px' }} src={`${DefaultImage}`} roundedCircle /> :  
                        <Image style={{ width: '30px', height: '30px' }} src={`/haru${ProfilePhoto}`} roundedCircle />
        }

      </DropdownToggle>
      <DropdownMenu right className="dropdown-menu-card">
        <div className="bg-white rounded-soft py-2">
          <DropdownItem tag={Link} to="/pages/auth/ProfileAndSettings">
            프로필수정 &amp; 개인설정
          </DropdownItem>
          <DropdownItem tag={Link} to="/pages/calendar">
            캘린더
          </DropdownItem>
          <DropdownItem divider />
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProfileDropdown;
