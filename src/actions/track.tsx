import { getAxios } from 'awry-utilities-2';

export const track = (params) => {
  return (dispatch) => {
    getAxios('track').then((instance) => {
      return instance.post('/activities/track_page.json', params);
    });
  };
};