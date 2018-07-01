import { BaseModel } from 'awry-utilities-2';
import * as _ from 'lodash';

class Settings extends BaseModel {
  constructor(attributes = {}) {
    super(_.assign({}, attributes));
  }
}

export default Settings;
