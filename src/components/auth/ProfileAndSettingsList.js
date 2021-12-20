import { point } from 'leaflet';
import React, { Fragment } from 'react';
//import '../../assets/css/index.css'
import styles from '../../assets/css/KanbanBoard.css'

import Profiles from './Profiles';
import Setting from './Setting';

const ProfileAndSettings = () => {
    return (
        <div className={styles.kanbanBoard}>
            <Profiles />
            <Setting />
        </div>
    );
};

export default ProfileAndSettings;