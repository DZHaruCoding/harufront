import React,{useState} from 'react';
import styles from '../../assets/scss/Cards.scss'
import SettingDetail from "./SettingDetail";

const Setting = () => {
    const [showDetails, setShowDetails] = useState(false);
    
    const styleSideColor ={
        position: 'absolute',
        zindex: -1,
        top: 0,
        left: 0,
        width: 3,
        height: '100%', 
        backgroundColor: '#bb8D31' 
    };

    return (
        <div className={styles.Card} style={{width:"50%"}}> 
            <div style={ styleSideColor }/>
            <div 
                className={
                    showDetails ?
                        [styles.Card__Title, styles.Card__Title__open].join(' ') : styles.Card__Title
                }
                onClick={(e)=> setShowDetails(!showDetails)} style={{display:"flex",justifyContent:"center", border:"1px solid black",backgroundColor:"white",borderRadius:"5px"}}>계정설정
            </div>
            {
                showDetails ?
                <div className={styles.Card__Details} style={{padding:"20px"}}>
                    <SettingDetail />
                </div> :
                null
            }
        </div>
    );
};

export default Setting;