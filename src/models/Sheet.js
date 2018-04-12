import { BaseModel } from 'awry-utilities';

import Attachment from './Attachment';
import User from './User';
import Stash from './Stash';

class Sheet extends BaseModel {
  constructor(attributes) {
    const newAttributes = Object.assign({
      cover_attachment: {},
      image_attachments: [],
      link_attachment: {},
      user: {},
      stash: {},
      role: null,
      attachment_type: 'image',
    }, attributes);

    super(newAttributes);

    this.cover_attachment = new Attachment(this.cover_attachment);
    this.image_attachments = this.image_attachments.map((attachment) => {
      return new Attachment(attachment);
    });
    this.link_attachment = new Attachment(this.link_attachment);
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

  isImage = () => {
    return this.attachment_type === 'image';
  }

  isLink = () => {
    return this.attachment_type === 'link';
  }
}

export default Sheet;
