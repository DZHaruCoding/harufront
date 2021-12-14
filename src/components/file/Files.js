import React from 'react';
import { Alert, Card, CardBody, Col, Row } from 'reactstrap';
import KanbanHeader from '../kanban/KanbanHeader';
import FavouriteItems from './FavouriteItems';
import FileProvider from './FileProvider';

const Files = () => {
  return (
    <Card>
      <KanbanHeader />
      <FileProvider>
        <FavouriteItems />
      </FileProvider>
    </Card>
  );
};

export default Files;
