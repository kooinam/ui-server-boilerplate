import { BaseModel } from 'awry-utilities';

import Sheet from './Sheet';
import Attachment from './Attachment';

class Stash extends BaseModel {
  constructor(attributes) {
    const newAttributes = Object.assign({
      name: 'Untitled',
      sheets: [],
      sheets_count: 0,
      users_count: 0,
      cover_image_attachment: {},
      role: null,
    }, attributes);

    super(newAttributes);

    this.sheets = this.sheets.map((sheet) => {
      return new Sheet(sheet);
    });
    this.cover_image_attachment = new Attachment(this.cover_image_attachment);
  }

  canAdmin = () => {
    return (this.role === 'admin' || this.role === 'owner');
  }

  canPost = () => {
    return (this.role === 'admin' || this.role === 'owner');
  }

  canJoin = () => {
    return (!this.role || this.role === 'left' || this.role === 'kicked');
  }

  canLeave = () => {
    return (this.role === 'member' || this.role === 'admin' || this.role === 'owner');
  }

  hasDescription = () => {
    return this.description && this.description.length > 0;
  }
}

export default Stash;
