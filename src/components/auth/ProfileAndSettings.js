import React, { Fragment } from 'react';
//import '../../assets/css/index.css'
import styles from '../../assets/css/KanbanBoard.css'
import ProfileAndSettingsList from './ProfileAndSettingsList'

const ProfileAndSettings = () => {
    return (
        <div>
            
            <h1 >{`프로필 & 계정설정`}</h1>
            <ProfileAndSettingsList />
        </div>
    );
};

export default ProfileAndSettings;