import { BaseModel } from 'awry-utilities-2';

class <%= name.capitalize() %> extends BaseModel {
  constructor(attributes) {
    const newAttributes = Object.assign({}, attributes);

    super(newAttributes);
  }
}

export default <%= name.capitalize() %>;
