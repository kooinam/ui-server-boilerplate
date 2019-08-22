/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Input, Button } from 'antd';
import { Actioner, getAxios, getFieldError } from 'awry-utilities-2';

import styles from './SignInForm.scss';
import { authenticated } from '../actions/auth';
import User from '../models/User';

const authMethodsInput = (form, actioner) => {
  let input = (
    <Row>
      <Col md={24}>
        <Form.Item {...getFieldError(actioner.error, 'email')} label="Email" hasFeedback>
          {form.getFieldDecorator('email', {
            rules: [
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Email is invalid' },
            ],
          })(
            <Input type="text" placeholder="Email" />,
          )}
        </Form.Item>
      </Col>
    </Row>
  )

  return input;
};

const signUpInput = (form, actioner) => {
  let input = (
    <Row>
      <Col md={24} />
    </Row>
  )

  return input;
};

const passwordInput = (form, actioner) => {
  return (
    <Row>
      <Col md={24}>
        <Form.Item {...getFieldError(actioner.error, 'password')} label="Password" hasFeedback>
          {form.getFieldDecorator('password', {
            rules: [
              { required: true, message: 'Password is required' },
            ],
          })(
            <Input type="password" placeholder="Password" />,
          )}
        </Form.Item>
      </Col>
    </Row>
  );
}

class SignInForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actioner: new Actioner({
        component: this,
        key: 'actioner',
        axiosGetter: () => getAxios('auth'),
        method: 'post',
        itemName: 'user',
        ItemKlass: User,
        successMessageGetter: user =>
          'Welcome back!',
        successCallback: (user) => {
          this.props.dispatch(authenticated(user));
          if (this.props.onAuthenticated) {
            this.props.onAuthenticated(user);
          }
        },
        errorMessageGetter: (error) => {
          return 'Log in failed';
        },
      }),
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((errors) => {
      if (errors) {
        return false;
      }

      const attributes = (this.props.form.getFieldsValue());
      const params = {
        user: attributes,
      };

      this.state.actioner.do('/sessions.json', params);
      return true;
    });
  }

  render() {
    const { form } = this.props;
    const { actioner } = this.state;

    return (
      <Form onSubmit={this.handleSubmit} className={`${styles.Component} ${this.props.className} `}>
        {authMethodsInput(form, actioner)}
        {passwordInput(form, actioner)}
        <Row>
          <Col md={24}>
            <Button htmlType="submit" type="primary" loading={this.state.actioner.isLoading} className={`btn-primary btn-block ${styles.SubmitButton}`}>
              LOGIN
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const connector = connect(
  (state) => {
    return {
      router: state.router,
    };
  }
);

export {
  authMethodsInput,
  signUpInput,
  passwordInput,
};

export default connector(Form.create()(SignInForm));
