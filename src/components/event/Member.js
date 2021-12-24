import React from "react";

const Member = ( {member,key})  => {
    
    // key();
    return(
        <div style={{marginBottom:"5px"}} className="">
            <div style={{borderBottom:"1px solid black"}} className="ml-2 mr-2">{member && member.userName}{' '}{member && member.userEmail}</div>
        </div>
    );
};


export default Member;