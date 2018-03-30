import { BaseModel } from 'awry-utilities';

import Attachment from './Attachment';

class Sheet extends BaseModel {
  constructor(attributes) {
    const newAttributes = Object.assign({
      cover_attachment: {},
    }, attributes);

    super(newAttributes);

    this.cover_attachment = new Attachment(this.cover_attachment);
  }

  hasDescription = () => {
    return this.description && this.description.length > 0;
  }
}

export default Sheet;
