import React, { useContext } from 'react';
import { Alert, Card, CardBody, Col, Row } from 'reactstrap';
import { ActivityContext } from '../../context/Context';
import { isIterableArray } from '../../helpers/utils';
import useFakeFetch from '../../hooks/useFakeFetch';
import FalconCardHeader from '../common/FalconCardHeader';
import Loader from '../common/Loader';
import ActivityContent from './ActivityContent';

const ActivityContainer = () => {
  const { activityLog, activityLogDispatch } = useContext(ActivityContext);
  const { loading, data: activities } = useFakeFetch(activityLog);
  return (
    <Card>
      <FalconCardHeader title="Activity Log" />
      <CardBody className="fs--1 p-0">
        {loading ? (
          <Loader />
        ) : isIterableArray(activities) ? (
          activities.map((activity, index) => {
            const roundedClass = activity.length === index + 1 ? 'rounded-top-0' : 'rounded-0';
            return (
              <ActivityContent
                key={index}
                className={`border-x-0 border-bottom-0 border-300 ${roundedClass}`}
                {...activity}
                to={'#'}
              />
            );
          })
        ) : (
          <Row className="p-card">
            <Col>
              <Alert color="info" className="mb-0">
                No activity found
              </Alert>
            </Col>
          </Row>
        )}
      </CardBody>
    </Card>
  );
};

export default ActivityContainer;
