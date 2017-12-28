import { BaseModel } from 'awry-utilities';

class User extends BaseModel {
  constructor(attributes) {
    const newAttributes = Object.assign({}, attributes);

    super(newAttributes);
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
    User.setToken(this.organization_profile.spree_api_key);
  }

  isAdmin = () => {
    return this.organization_profile.role_index == 0;
  }
}

export default User;
