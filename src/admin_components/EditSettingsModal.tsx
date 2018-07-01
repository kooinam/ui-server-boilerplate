import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Row, Col, Input } from 'antd';
import { Actioner, getAxios, getFieldError } from 'awry-utilities-2';

import Settings from '../models/Settings';

const styles = require('./EditSettingsModal.scss');

class EditSettingsModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actioner: new Actioner({
        component: this,
        key: 'actioner',
        axiosGetter: () => getAxios('admin'),
        method: 'patch',
        itemName: 'settings',
        ItemKlass: Settings,
        successMessageGetter: (settings) => {
          return 'Settings updated successfully';
        },
        successCallback: (settings) => {
          this.props.modalParams.dismiss();
          if (this.props.onSuccess) {
            this.props.onSuccess(settings);
          }
        },
        errorMessageGetter: (error) => {
          return 'Failed to update settings';
        },
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
        settings: attributes,
      };


      this.state.actioner.do('/settings.json', params);

      return true;
    });
  }

  render() {
    const { settings, form } = this.props;
    const { actioner } = this.state;

    return (
      <Modal maskClosable={false} title="Edit Settings" visible={this.props.modalParams.visible} onCancel={this.handleCancel} onOk={this.handleOk} okText="Confirm" cancelText="Cancel" confirmLoading={this.state.actioner.isLoading} className={styles.Component}>
        <Form>
          <Row gutter={16}>
            <Col md={24}>
              <Form.Item {...getFieldError(actioner.error, 'client_host')} label="Client Host" hasFeedback>
                {form.getFieldDecorator('client_host', {
                  rules: [
                    { required: true, message: 'Client Host is required' },
                  ],
                  initialValue: settings.client_host,
                })(
                  <Input type="text" placeholder="Client Host" />,
                )}
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item {...getFieldError(actioner.error, 'sender_email')} label="Sender Email" hasFeedback>
                {form.getFieldDecorator('sender_email', {
                  rules: [
                    { required: true, message: 'Sender Email is required' },
                  ],
                  initialValue: settings.sender_email,
                })(
                  <Input type="text" placeholder="Sender Email" />,
                )}
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item {...getFieldError(actioner.error, 'bcc_email')} label="BCC Email" hasFeedback>
                {form.getFieldDecorator('bcc_email', {
                  rules: [
                    { required: true, message: 'BCC Email is required' },
                  ],
                  initialValue: settings.bcc_email,
                })(
                  <Input type="text" placeholder="BCC Email" />,
                )}
              </Form.Item>
            </Col>
          </Row>
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

export default connector(Form.create()(EditSettingsModal));
