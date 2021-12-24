import React, { useEffect, useState } from 'react';
import { ProfileContext } from '../../context/Context';

const ProfileProvider = ({children}) => {
    const [ProfilePhoto, setProfilePhoto] = useState("");

    useEffect(()=>{
        const photoFetch = async () => {

            const emailJson = { userEmail: window.sessionStorage.getItem("authUserEmail") };

            try {
                const response = await fetch(`/haru/user/findUserProfile`, {
                    method: 'post',
                    headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                    },
                    body: JSON.stringify(emailJson)
                  });
            
                  if (!response.ok) {
                    throw new Error(`${response.status} ${response.statusText}`);
                  }
            
                  const json = await response.json();

                  if (json.result !== 'success') {
                    throw json.message;
                  }
            
                  
                  if (json.data) {
                    setProfilePhoto(json.data.userPhoto);
                  }
            } catch(err) {
                console.error(err);
            }
        }
        photoFetch();
    },[])

    const value = {
        ProfilePhoto,
        setProfilePhoto
    } 
    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
};

export default ProfileProvider;