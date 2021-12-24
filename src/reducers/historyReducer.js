export const historyReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'ALADD':
      console.log('초기세팅?');
      console.log('초기세팅?', payload.AddArr);
      return [...state, ...payload.AddArr];
    case 'HISADD':
      console.log('여기왔나?');
      console.log('여기왔나?', payload);
      return [payload, ...state];
  }
};
