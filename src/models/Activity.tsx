import { BaseModel } from 'awry-utilities-2';
import * as _ from 'lodash';

import Session from './Session';

class Activity extends BaseModel {
  constructor(attributes = {}) {
    const newAttributes = _.assign({
      session: {},
      actor_changes: [],
      extras: [],
    }, attributes);

    super(newAttributes);

    this.session = new Session(this.session);
  }

  session : any;
}

export default Activity;
