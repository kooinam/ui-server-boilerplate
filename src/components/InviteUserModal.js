/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form, Row, Col } from 'antd';
import type { Connector } from 'react-redux';
import { getAxios, getFieldError, Actioner, FilterSelect, TableParams } from 'awry-utilities';
import { push } from 'react-router-redux';

import type { Reducer } from '../../types';
import styles from './InviteUserModal.scss';
import User from '../models/User';

class InviteInputs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      usersTableParams: new TableParams({
        component: this,
        key: 'usersTableParams',
        axiosGetter: () => getAxios('toro-client'),
        itemsName: 'users',
        ItemKlass: User,
        url: '/users.json',
        pagination: {
          per_page: 10,
        },
        filter: {
          s: ['username ASC'],
        },
      }),
    };
  }

  render() {
    const { component, actioner, form, sheet, edit } = this.props;
    const { usersTableParams } = this.state;

    return (
      <Row>
        <Col sm={(edit) ? 24 : 12}>
          <Row>
            <Col sm={24}>
              <FilterSelect
                tableParams={usersTableParams}
                filterFields={['name_cont']}
                initialValue={this.props.stash}
                keyField='id'
                labelField='name'
                name={'Stash'}
                form={form}
                formKey="stash_id"
                error={actioner.error}
                errorKeys={['stash_id']}
                disabled={(this.props.stash) ? true : false}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

class InviteUserModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actioner: new Actioner({
        component: this,
        key: 'actioner',
        axiosGetter: () => getAxios('toro-client'),
        method: 'post',
        itemName: 'user',
        ItemKlass: User,
        successMessageGetter: (sheet) => {
          return 'Users invited successfully';
        },
        successCallback: (sheet) => {
          this.props.modalParams.dismiss();
        },
        errorMessageGetter: (error) => {
          return `Failed to invite Users`;
        },
      }),
    };
  }

  handleSubmit = () => {
    const { form, stash } = this.props;

    form.validateFields((errors) => {
      if (errors) {
        return false;
      }

      const attributes = form.getFieldsValue();
      const params = {
        invite: attributes,
      };

      this.state.actioner.do(`/stashes/${stash.id}/users/invite.json`, params);

      return true;
    });
  }

  render() {
    const { modalParams, stash, sheet, form } = this.props;
    const { actioner, isUploading } = this.state;

    const footer = [(
      <Button
        key="cancel"
        className="btn-tertiary"
        onClick={modalParams.dismiss}
      >
        Cancel
      </Button>
    ), (
      <Button
        key="ok"
        className="btn-primary"
        onClick={this.handleSubmit}
        loading={actioner.isLoading}
      >
        OK
      </Button>
    )];

    return (
      <Modal
        className={styles.Component}
        maskClosable={false}
        title="Invite Users"
        visible={modalParams.visible}
        footer={footer}
        onCancel={modalParams.dismiss}
      >
        <Form>
          <InviteInputs {...{ stash, sheet, form, actioner, component: this, }} />;
        </Form>
      </Modal>
    );
  }
}

/* eslint-disable no-unused-vars */
const connector: Connector<{}, Props> = connect(
  (reducer: Reducer) => ({}),
);
/* eslint-enable no-unused-vars */

export default connector(Form.create()(InviteUserModal));
