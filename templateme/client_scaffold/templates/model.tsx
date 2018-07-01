import { BaseModel } from 'awry-utilities-2';
import * as _ from 'lodash';

class <%= name.capitalize() %> extends BaseModel {
  constructor(attributes = {}) {
    super(_.assign({}, attributes));
  }
}

export default <%= name.capitalize() %>;
