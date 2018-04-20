import { BaseModel } from 'awry-utilities-2';

class Attachment extends BaseModel {
  constructor(attributes) {
    const newAttributes = Object.assign({}, attributes);

    super(newAttributes);
  }

  isImage = () => {
    return this.type === 'ImageAttachment';
  }

  isLink = () => {
    return this.type === 'LinkAttachment';
  }
}

export default Attachment;
