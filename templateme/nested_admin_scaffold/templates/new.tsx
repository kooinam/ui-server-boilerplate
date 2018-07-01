import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Modal, Form, Input } from 'antd';
import { Actioner, getAxios, getFieldError } from 'awry-utilities-2';

import <%= name.capitalize() %> from '../models/<%= name.capitalize() %>';

const styles = require('./New<%= name.capitalize() %>Modal.scss');

class <%= name.capitalize() %>Inputs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  props: any;
  state: any;

  render() {
    const { actioner, form, <%= name.camelcase() %> } = this.props;

    return (
      <div>
        <Row>
          <Col md={12}>
            <Form.Item {...getFieldError(actioner.error, '<%= titleField %>')} label="<%= titleField.split().capitalize() %>" hasFeedback>
              {form.getFieldDecorator('<%= titleField %>', {
                rules: [
                  { required: true, message: '<%= titleField.split().capitalize() %> is required' },
                ],
                initialValue: <%= name.camelcase() %>.<%= titleField %>,
              })(
                <Input type="text" placeholder="<%= titleField.split().capitalize() %>" />,
              )}
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
  }
}

const massageParams = (params) => {
  return params;
}

export {
  <%= name.capitalize() %>Inputs, massageParams,
};

class New<%= name.capitalize() %>Modal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actioner: new Actioner({
        component: this,
        key: 'actioner',
        axiosGetter: () => getAxios('<%= axiosName %>'),
        method: 'post',
        itemName: '<%= name %>',
        ItemKlass: <%= name.capitalize() %>,
        successMessageGetter: <%= name.camelcase() %> =>
          `New <%= name.split().capitalize() %> ${<%= name.camelcase() %>.<%= titleField %>} created successfully`,
        successCallback: (<%= name.camelcase() %>) => {
          this.props.modalParams.dismiss();
          if (this.props.onSuccess) {
            this.props.onSuccess(<%= name.camelcase() %>);
          }
        },
        errorMessageGetter: error =>
          'Failed to create <%= name.split().capitalize() %>',
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
      let params = {
        <%= name %>: attributes,
      };

      params = massageParams(params);

      this.state.actioner.do(`/${this.props.apiPrefix}/<%= name.pluralize() %>.json`, params);
      return true;
    });
  }

  render() {
    const { <%= name.camelcase() %>, form } = this.props;
    const { actioner } = this.state;

    return (
      <Modal maskClosable={false} title="New <%= name.split().capitalize() %>" visible={this.props.modalParams.visible} onCancel={this.handleCancel} onOk={this.handleOk} okText="Confirm" cancelText="Cancel" confirmLoading={this.state.actioner.isLoading} className={styles.Component}>
        <Form>
          <<%= name.capitalize() %>Inputs {...{ <%= name.camelcase() %>, form, actioner }} />
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

export default connector(Form.create()(New<%= name.capitalize() %>Modal));
