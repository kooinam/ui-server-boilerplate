import uuidV4 from 'uuid/v4';

export default (state = {
  uuid: uuidV4(),
  deleteSheet: null,
  updateSheet: null,
}, action) => {
  switch (action.type) {
    case 'DELETE_SHEET':
      return Object.assign({}, state, {
        uuid: uuidV4(),
        deleteSheet: action.payload.sheet,
      });
    case 'UPDATE_SHEET':
      return Object.assign({}, state, {
        uuid: uuidV4(),
        updateSheet: action.payload.sheet,
      });
    case 'CREATE_SHEET':
      return Object.assign({}, state, {
        uuid: uuidV4(),
        createSheet: action.payload.sheet,
      });
    default:
      return state;
  }
};
