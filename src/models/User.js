import { BaseModel } from 'awry-utilities-2';

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
    const tokenPrefix = User.tokenPrefix || 'quest';

    return (tokenPrefix && tokenPrefix.length > 0) ? `${tokenPrefix}-token` : 'token';
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
    return this.role === 'admin';
  }
}

export default User;
