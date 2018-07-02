import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Modal, Form, Input } from 'antd';
import { Actioner, getAxios, getFieldError, SimpleSelect } from 'awry-utilities-2';

import User from '../models/User';

const styles = require('./NewUserModal.scss');

class UserInputs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  props: any;
  state: any;

  render() {
    const { actioner, form, user, edit } = this.props;

    const roles = [{
      key: 'member',
      label: 'member',
    }, {
      key: 'admin',
      label: 'admin',
    }];

    return (
      <div>
        <Row>
          <Col md={24}>
            <Form.Item {...getFieldError(actioner.error, 'email')} label="Email" hasFeedback>
              {form.getFieldDecorator('email', {
                rules: [
                  { required: true, message: 'Email is required' },
                ],
                initialValue: user.email,
              })(
                <Input type="text" placeholder="Email" disabled={edit} />,
              )}
            </Form.Item>
          </Col>
          <Col md={24}>
            <Form.Item {...getFieldError(actioner.error, 'password')} label="Password" hasFeedback>
              {form.getFieldDecorator('password', {
                rules: (edit) ? [] : [
                  { required: true, message: 'Password is required' },
                ],
                initialValue: user.password,
              })(
                <Input type="password" placeholder="Password" />,
              )}
            </Form.Item>
          </Col>
          {
            edit && (
              <Col md={24}>
                <Form.Item {...getFieldError(actioner.error, 'authentication_token')} label="Token" hasFeedback>
                  {form.getFieldDecorator('authentication_token', {
                    rules: (edit) ? [] : [
                      { required: true, message: 'Token is required' },
                    ],
                    initialValue: user.authentication_token,
                  })(
                    <Input placeholder="Token" />,
                  )}
                </Form.Item>
              </Col>
            )
          }
          <Col md={24}>
            <SimpleSelect
              items={roles}
              required
              name={'Role'}
              form={form}
              formKey="role"
              error={actioner.error}
              errorKeys={['role']}
              showLabel
              initialValue={
                (user.role) ? {
                  key: user.role,
                  label: user.role,
                } : undefined
              }
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export {
  UserInputs,
};

class NewUserModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actioner: new Actioner({
        component: this,
        key: 'actioner',
        axiosGetter: () => getAxios('admin'),
        method: 'post',
        itemName: 'user',
        ItemKlass: User,
        /* eslint-disable no-unused-vars */
        successMessageGetter: user =>
          `New User ${user.email} created successfully`,
        successCallback: (user) => {
          this.props.modalParams.dismiss();
          if (this.props.onSuccess) {
            this.props.onSuccess(user);
          }
        },
        errorMessageGetter: error =>
          'Failed to create User',
        /* eslint-enable no-unused-vars */
      }),
    };
  }

  props: any;
  state: any;

  handleCancel = () => {
    this.props.modalParams.dismiss();
  }

  handleOk = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return false;
      }

      const attributes = (this.props.form.getFieldsValue());
      const params = {
        user: attributes,
      };

      if (params.user.role) {
        params.user.role = params.user.role.key;
      }

      this.state.actioner.do('/users.json', params);
      return true;
    });
  }

  render() {
    const { user, form } = this.props;
    const { actioner } = this.state;

    return (
      <Modal maskClosable={false} title="New user" visible={this.props.modalParams.visible} onCancel={this.handleCancel} onOk={this.handleOk} okText="Confirm" cancelText="Cancel" confirmLoading={this.state.actioner.isLoading} className={styles.Component}>
        <Form>
          <UserInputs {...{ user, form, actioner }} />
        </Form>
      </Modal>
    );
  }
}

const connector = connect(
  (reducer) => {
    return {};
  }
);

export default connector(Form.create()(NewUserModal));