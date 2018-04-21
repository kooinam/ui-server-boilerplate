import { BaseModel } from 'awry-utilities-2';
import * as _ from 'lodash';

class <%= name.capitalize() %> extends BaseModel {
  constructor(attributes = {}) {
    const newAttributes = _.assign({}, attributes);

    super(newAttributes);
  }
}

export default <%= name.capitalize() %>;
