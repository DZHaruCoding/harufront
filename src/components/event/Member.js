import React from "react";

const Member = ( {member})  => {
    return(
        <div>
            <p>{member && member.userName}{' '}{member && member.userEmail}</p>
        </div>
    );
    };


export default Member;