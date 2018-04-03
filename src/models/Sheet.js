import { BaseModel } from 'awry-utilities';

import Attachment from './Attachment';
import User from './User';
import Stash from './Stash';

class Sheet extends BaseModel {
  constructor(attributes) {
    const newAttributes = Object.assign({
      cover_attachment: {},
      attachments: [],
      user: {},
      stash: {},
      role: null,
    }, attributes);

    super(newAttributes);

    this.cover_attachment = new Attachment(this.cover_attachment);
    this.attachments = this.attachments.map((attachment) => {
      return new Attachment(attachment);
    });
    this.user = new User(this.user);
    this.stash = new Stash(this.stash);
  }

  hasTitle = () => {
    return this.title && this.title.length > 0;
  }

  hasDescription = () => {
    return this.description && this.description.length > 0;
  }

  canEdit = () => {
    return this.stash.canPost();
  }

  canDelete = () => {
    return this.stash.canPost();
  }
}

export default Sheet;
