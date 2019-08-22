import { BaseModel } from 'awry-utilities-2';

class User extends BaseModel {
  constructor(attributes) {
    const newAttributes = Object.assign({}, attributes);

    super(newAttributes);
  }

  static setTokenPrefix = (tokenPrefix) => {
    User.tokenPrefix = tokenPrefix;
  }

  static getTokenName = () => {
    const tokenPrefix = User.tokenPrefix || 'boilerplate';

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
}

export default User;
