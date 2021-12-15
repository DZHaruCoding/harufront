import React from "react";

const Member = ( {member})  => {
    console.log(member);
    return(
        <div>
            <h5>{member.userName}</h5>
        </div>
    );
    };


export default Member;