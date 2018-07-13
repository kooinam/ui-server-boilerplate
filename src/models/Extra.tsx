import { BaseModel } from 'awry-utilities-2';
import * as _ from 'lodash';
import { formatBooleanSign } from 'awry-utilities-2';

class Extra extends BaseModel {
  constructor(attributes = {}) {
    super(_.assign({}, attributes));
  }

  value: any

  getValue = () => {
    let value = this.value;

    if (typeof(value) === 'boolean') {
      return formatBooleanSign(value);
    } else if (typeof(value) === 'object') {
      return JSON.stringify(value);
    }

    return value;
  }
}

export default Extra;
