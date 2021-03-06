/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Input, Button } from 'antd';
import { Actioner, getAxios, getFieldError } from 'awry-utilities-2';

import styles from './SignUpForm.scss';
import { authenticated } from '../actions/auth';
import { authMethodsInput, passwordInput, signUpInput } from './SignInForm';
import User from '../models/User';

class SignUpForm extends React.Component {
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
        /* eslint-disable no-unused-vars */
        successMessageGetter: user =>
          'Welcome aboard!',
        successCallback: (user) => {
          this.props.dispatch(authenticated(user));
          if (this.props.onAuthenticated) {
            this.props.onAuthenticated(user);
          }
        },
        errorMessageGetter: error =>
          'Register failed',
        /* eslint-enable no-unused-vars */
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

      this.state.actioner.do('/users.json', params);
      return true;
    });
  }

  render() {
    const { form } = this.props;
    const { actioner } = this.state;

    return (
      <Form onSubmit={this.handleSubmit} className={styles.Component}>
        {authMethodsInput(form, actioner)}
        {signUpInput(form, actioner)}
        {passwordInput(form, actioner)}
        <Row>
          <Col md={24}>
            <Button htmlType="submit" type="primary" loading={this.state.actioner.isLoading} className={`btn-primary btn-block ${styles.SubmitButton}`}>
              REGISTER
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

export default connector(Form.create()(SignUpForm));
