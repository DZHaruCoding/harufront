import React from "react";

const Member = ( {member})  => {
    return(
        <div>
            <h5>{member && member.userName}</h5>
        </div>
    );
    };


export default Member;