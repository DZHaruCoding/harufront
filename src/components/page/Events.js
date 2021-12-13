import React, {useEffect, useState} from 'react';
import { Alert, Card, CardBody, Col, CustomInput, Form, Row } from 'reactstrap';
import EventSummary from '../event/EventSummary';
import Loader from '../common/Loader';
import FalconCardHeader from '../common/FalconCardHeader';
import useFakeFetch from '../../hooks/useFakeFetch';
import rawEvents from '../../data/event/events';
import eventCategories from '../../data/event/eventCategories';
import createMarkup from '../../helpers/createMarkup';
import { isIterableArray } from '../../helpers/utils';
import { localIp } from '../../config';

const Events = () => {
  const { loading, data: events } = useFakeFetch(rawEvents);
  const [projects,setProjects] = useState([]);

  //useEffect에 async 바로 주지말고 함수 만들어서 함수에 async
  useEffect( () => {
    const data = async ()=>{ 
    try {
      const response = await fetch(`${localIp}/api/project/1`,{
        method: 'get',
        headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: null
      });

      //성공하면
      if(!response.ok){
          throw new Error(`${response.status} ${response.statusText}`);
      }
      //결과를 json으로 변환
      const jsonResult = await response.json();
      console.log(jsonResult.data);
      //통신은 했지만 결과값이 success가 아니면 
      if(jsonResult.result !== 'success'){
          throw new Error(`${jsonResult.result} ${jsonResult.message}`);
      }

      // setEmails에 데이터 셋팅하기
      setProjects(jsonResult.data);

    } catch (error) {
      console.log(error);
    }
  }
  data();
  },[]);
  
  return (
    <Card>
      <FalconCardHeader title="Events">
        {isIterableArray(eventCategories) && (
          <Form inline>
            <CustomInput type="select" id="customSelectCategory" name="customSelectCategory" bsSize="sm">
              {eventCategories.map((option, index) => (
                <option value={index} key={index}>
                  {option}
                </option>
              ))}
            </CustomInput>
          </Form>
        )}
      </FalconCardHeader>
      <CardBody className="fs--1">
        {loading ? (
          <Loader />
        ) : isIterableArray(events) ? (
          <EventSummary  projects={projects}/>
        ) : (
          <Alert color="info" className="mb-0">
            No events found!
          </Alert>
        )}
      </CardBody>
    </Card>
  );
};

export default Events;
