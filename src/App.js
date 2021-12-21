import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './layouts/Layout';

import 'react-toastify/dist/ReactToastify.min.css';
import 'react-datetime/css/react-datetime.css';
import 'react-image-lightbox/style.css';
import ProfileProvider from './components/auth/ProfileProvider';

const App = () => {

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <ProfileProvider>
        <Layout />
      </ProfileProvider>
    </Router>
  );
};

export default App;
