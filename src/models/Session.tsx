import { BaseModel } from 'awry-utilities-2';
import * as _ from 'lodash';

import User from './User';

class Session extends BaseModel {
  constructor(attributes = {}) {
    const newAttributes = _.assign({
      user: {},
    }, attributes);

    super(newAttributes);

    this.user = new User(this.user);
  }

  user: any;
}

export default Session;
