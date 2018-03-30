export const authenticating = () =>
  dispatch =>
    dispatch({
      type: 'AUTHENTICATING',
    });

export const authenticated = user =>
  (dispatch) => {
    if (user) {
      dispatch({
        type: 'AUTHENTICATED',
        payload: {
          currentUser: user,
        },
      });
    } else if (user === undefined) {
      // authenticate failed for unknown reason
      dispatch({
        type: 'UNAUTHENTICATED',
      });
    } else {
      // unauthenticated
      dispatch({
        type: 'UNAUTHENTICATED',
      });
    }
  };

export const showSignInModal = () => {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_SIGN_IN_MODAL',
    });
  };
};

export const hideSignInModal = () => {
  return (dispatch) => {
    dispatch({
      type: 'HIDE_SIGN_IN_MODAL',
    });
  };
};