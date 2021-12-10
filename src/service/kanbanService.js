import { localIp } from '../config';
import React from 'react';

export const kanbanList = async () => {
  try {
    console.log('Asdad');
    const response = await fetch(`${localIp}/api/tasklist/data/2`, {
      method: 'get',
      header: {
        'Content-Type:': 'application/json',
        Accept: 'application'
      },
      body: null
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const jsonResult = await response.json();

    if (jsonResult.result != 'success') {
      throw new Error(`${jsonResult.result} ${jsonResult.message}`);
    }

    return jsonResult.data;
    console.log(jsonResult.data);
  } catch (err) {
    console.log(err);
    return null;
  }
};

export default { kanbanList };
