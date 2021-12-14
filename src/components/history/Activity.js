import React from 'react';
import { Alert, Card, CardBody, Col, Row } from 'reactstrap';
import Loader from '../common/Loader';
import FalconCardHeader from '../common/FalconCardHeader';
import { isIterableArray } from '../../helpers/utils';
import useFakeFetch from '../../hooks/useFakeFetch';
import rawActivities from '../../data/activity/activities';
import KanbanHeader from '../kanban/KanbanHeader';
import ActivityContent from './ActivityContent';
import ActivityContainer from './ActivityContainer';
import ActivityProvider from './ActivityProvider';

const Activity = () => {
  return (
    <Card>
      <KanbanHeader />
      <ActivityProvider>
        <ActivityContainer />
      </ActivityProvider>
    </Card>
  );
};

export default Activity;
