import { BaseModel } from 'awry-utilities';

import Attachment from './Attachment';

class User extends BaseModel {
  constructor(attributes) {
    const newAttributes = Object.assign({
      avatar_image_attachment: {},
    }, attributes);

    super(newAttributes);

    this.avatar_image_attachment = new Attachment(this.avatar_image_attachment);
  }

  static setTokenPrefix = (tokenPrefix) => {
    User.tokenPrefix = tokenPrefix;
  }

  static getTokenName = () => {
    return (User.tokenPrefix && User.tokenPrefix.length > 0) ? `${User.tokenPrefix}-token` : 'token';
  }

  static getToken = () => {
    const token = User.getCookie(User.getTokenName());
    if (token === 'undefined') {
      return null;
    }

    return token;
  }

  static setToken = (token) => {
    if (token) {
      User.setCookie(User.getTokenName(), token);
    } else {
      User.removeToken();
    }
  }

  static removeToken = () => {
    User.removeCookie(User.getTokenName());
  }

  authenticate = () => {
    User.setToken(this.authentication_token);
  }

  isAdmin = () => {
    return this.is_admin;
  }

  canMakeAdmin = () => {
    return (this.role === 'member');
  }

  canMakeMember = () => {
    return (this.role === 'admin');
  }

  canKickedByOwner = () => {
    return (this.role === 'member' || this.role === 'admin');
  }

  canKickedByAdmin = () => {
    return (this.role === 'member');
  }

  canAccept = () => {
    return (this.role === 'requesting');
  }

  canReject = () => {
    return (this.role === 'requesting');
  }
}

export default User;
