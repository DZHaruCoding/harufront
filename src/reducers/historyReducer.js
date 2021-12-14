export const historyReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'ALADD':
      return [...state, ...payload.data];
  }
};
