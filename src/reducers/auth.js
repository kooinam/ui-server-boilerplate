import User from '../models/User';

export default (state = {
  signInModalVisible: false,
  state: null,
  currentUser: null,
}, action) => {
  switch (action.type) {
    case 'AUTHENTICATING':
      return Object.assign({}, state, {
        state: 'AUTHENTICATING',
      });
    case 'AUTHENTICATED':
      action.payload.currentUser.authenticate();
      return Object.assign({}, state, {
        state: 'AUTHENTICATED',
        currentUser: action.payload.currentUser,
      });
    case 'UNAUTHENTICATED':
      User.removeToken();
      return Object.assign({}, state, {
        state: 'UNAUTHENTICATED',
        currentUser: null,
      });
    case 'SHOW_SIGN_IN_MODAL':
      return Object.assign({}, state, {
        signInModalVisible: true,
      });
    case 'HIDE_SIGN_IN_MODAL':
      return Object.assign({}, state, {
        signInModalVisible: false,
      });
    default:
      return state;
  }
};
