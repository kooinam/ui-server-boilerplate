import { BaseModel } from 'awry-utilities-2';
import * as _ from 'lodash';

import Session from './Session';
import ActorChange from './ActorChange';
import Extra from './Extra';
import { renderActivity } from '../utils/UtilityManager';

class Activity extends BaseModel {
  constructor(attributes = {}) {
    super(_.assign({
      session: {},
      actor_changes: [],
      extras: [],
      link_params: {},
      owner: {},
      key: '',
      actor: {},
    }, attributes));

    this.session = new Session(this.session);
    this.actor_changes = this.actor_changes.map((actorChange) => {
      return new ActorChange(actorChange);
    });
    this.extras = this.extras.map((extra) => {
      return new Extra(extra);
    });
  }

  session : any;
  description: any;
  link_params: any;
  actor_changes: any;
  key: any;
  extras: any;

  getDescription = (namespace) => {
    return renderActivity(namespace, this);
  }

  getExtraValue = (key) => {
    const extra = _.find(this.extras, (extra) => {
      return extra.key === key;
    });

    if (extra) {
      return extra.value;
    }

    return null;
  }
}

export default Activity;
