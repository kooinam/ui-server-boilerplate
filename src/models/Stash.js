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
      need_approval: true,
      is_private: true,
    }, attributes);

    super(newAttributes);

    this.sheets = this.sheets.map((sheet) => {
      return new Sheet(sheet);
    });
    this.cover_image_attachment = new Attachment(this.cover_image_attachment);
  }

  isOwner = () => {
    return (this.role === 'owner');
  }

  isAdmin = () => {
    return (this.role === 'admin' || this.role === 'owner');
  }

  isMember = () => {
    return (this.role === 'member' || this.role === 'admin' || this.role === 'owner');
  }

  isJoining = () => {
    return this.role === 'requesting';
  }

  canAdmin = () => {
    return this.isAdmin();
  }

  canPost = () => {
    return (this.only_admin_can_post === false && this.isMember()) || (this.only_admin_can_post && this.isAdmin());
  }

  canJoin = () => {
    return this.isMember() === false && this.isJoining() === false;
  }

  canCancelJoin = () => {
    return this.isJoining();
  }

  canLeave = () => {
    return this.isMember();
  }

  canInvite = () => {
    return false;
  }

  canViewContent = () => {
    return (this.is_private === false) || (this.is_private && this.isMember());
  }

  canMakeAdmin = (user) => {
    return this.isOwner() && user.canMakeAdmin();
  }

  canMakeMember = (user) => {
    return this.isOwner() && user.canMakeMember();
  }

  canKick = (user) => {
    return (this.isAdmin() && user.canKickedByAdmin()) || (this.isOwner() && user.canKickedByOwner());
  }

  canAccept = (user) => {
    return this.isAdmin() && user.canAccept();
  }

  canReject = (user) => {
    return this.isAdmin() && user.canReject();
  }

  hasDescription = () => {
    return this.description && this.description.length > 0;
  }
}

export default Stash;
