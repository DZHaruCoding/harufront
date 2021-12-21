import React, { useState } from 'react';
import { ProfileContext } from '../../context/Context';

const ProfileProvider = ({children}) => {
    const [ProfilePhoto, setProfilePhoto] = useState("");

    const value = {
        ProfilePhoto,
        setProfilePhoto
    } 
    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
};

export default ProfileProvider;