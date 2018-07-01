import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, Form } from 'antd';
import { Actioner, getAxios } from 'awry-utilities-2';

import <%= name.capitalize() %> from '../models/<%= name.capitalize() %>';
import { <%= name.capitalize() %>Inputs, massageParams } from './New<%= name.capitalize() %>Modal';

const styles = require('./Edit<%= name.capitalize() %>Modal.scss');

class Edit<%= name.capitalize() %>Modal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actioner: new Actioner({
        component: this,
        key: 'actioner',
        axiosGetter: () => getAxios('<%= axiosName %>'),
        method: 'patch',
        itemName: '<%= name %>',
        ItemKlass: <%= name.capitalize() %>,
        successMessageGetter: (<%= name.camelcase() %>) => {
          return `<%= name.split().capitalize() %> ${<%= name.camelcase() %>.<%= titleField %>} updated successfully`;
        },
        successCallback: (<%= name.camelcase() %>) => {
          this.props.modalParams.dismiss();
          if (this.props.onSuccess) {
            this.props.onSuccess(<%= name.camelcase() %>);
          }
        },
        errorMessageGetter: (error) => {
          return `Failed to update <%= name.split().capitalize() %> ${this.props.<%= name.camelcase() %>.<%= titleField %>}`;
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
      let params = {
        <%= name %>: attributes,
      };

      params = massageParams(params);

      this.state.actioner.do(`/stores/${this.props.storeId}/<%= name.pluralize() %>/${this.props.<%= name.camelcase() %>.<%= apiField %>}.json`, params);
      return true;
    });
  }

  render() {
    const { <%= name.camelcase() %>, form } = this.props;
    const { actioner } = this.state;

    return (
      <Modal maskClosable={false} title="Edit <%= name.capitalize().split() %>" visible={this.props.modalParams.visible} onCancel={this.handleCancel} onOk={this.handleOk} okText="Confirm" cancelText="Cancel" confirmLoading={this.state.actioner.isLoading} className={styles.Component}>
        <Form>
          <<%= name.capitalize() %>Inputs {...{ <%= name.camelcase() %>, form, actioner, edit: true }} />
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

export default connector(Form.create()(Edit<%= name.capitalize() %>Modal));
