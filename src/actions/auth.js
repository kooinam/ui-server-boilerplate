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
