import { useEffect, useState } from 'react';

const useFakeFetchV2 = (resolvedData, waitingTime = 500) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    let isMounted = true;
    setTimeout(() => {
      if (isMounted && resolvedData.length !== 0) {
        setData(resolvedData);
        setLoading(false);
      }
    }, waitingTime);

    return () => (isMounted = false);
  }, [resolvedData, waitingTime]);

  return { loading, setLoading, data, setData };
};

export default useFakeFetchV2;
