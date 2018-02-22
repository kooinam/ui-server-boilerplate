import { BaseModel } from 'awry-utilities';

class Log extends BaseModel {
  constructor(attributes) {
    const newAttributes = Object.assign({}, attributes);

    super(newAttributes);
  }
}

export default Log;
