import { BaseModel } from 'awry-utilities';

class Attachment extends BaseModel {
  constructor(attributes) {
    const newAttributes = Object.assign({}, attributes);

    super(newAttributes);
  }

  isImage = () => {
    return this.type === 'ImageAttachment';
  }
}

export default Attachment;
