export const deleteSheet = (sheet) => {
  return (dispatch) => {
    dispatch({
      type: 'DELETE_SHEET',
      payload: {
        sheet: sheet,
      },
    });
  };
};

export const updateSheet = (sheet) => {
  return (dispatch) => {
    dispatch({
      type: 'UPDATE_SHEET',
      payload: {
        sheet: sheet,
      },
    });
  };
};

export const createSheet = (sheet) => {
  return (dispatch) => {
    dispatch({
      type: 'CREATE_SHEET',
      payload: {
        sheet: sheet,
      },
    });
  };
};