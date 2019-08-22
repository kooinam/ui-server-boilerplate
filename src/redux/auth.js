import User from '../models/User';

export default (state = {
  signInModalVisible: false,
  signUpModalVisible: false,
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
      if (action.payload && action.payload.reason !== 'unknown') {
        User.removeToken();
      }
      return Object.assign({}, state, {
        state: 'UNAUTHENTICATED',
        currentUser: null,
      });
    case 'SHOW_SIGN_IN_MODAL':
      return Object.assign({}, state, {
        signInModalVisible: true,
        onAuthenticated: action.payload.onAuthenticated,
      });
    case 'HIDE_SIGN_IN_MODAL':
      return Object.assign({}, state, {
        signInModalVisible: false,
        onAuthenticated: action.payload.onAuthenticated,
      });
    case 'SHOW_SIGN_UP_MODAL':
      return Object.assign({}, state, {
        signUpModalVisible: true,
        onAuthenticated: action.payload.onAuthenticated,
      });
    case 'HIDE_SIGN_UP_MODAL':
      return Object.assign({}, state, {
        signUpModalVisible: false,
        onAuthenticated: action.payload.onAuthenticated,
      });
    default:
      return state;
  }
};
