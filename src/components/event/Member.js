import React from "react";

const Member = ( {member,key})  => {
    
    // key();
    return(
        <div style={{marginBottom:"5px"}} className="ml-2">
            <div>{member && member.userName}{' '}{member && member.userEmail}</div>
        </div>
    );
};


export default Member;