import * as React from 'react';
import { connect } from 'react-redux';
import { ModalParams, DetailsContainer, Actioner, getAxios } from 'awry-utilities-2';
import { Row, Col, Button, Popconfirm } from 'antd';
import { push } from 'react-router-redux';

import User from '../models/User';
import EditUserModal from '../components/EditUserModal';
import CreatedAt from '../components/CreatedAt';

const styles = require('./UserSection.scss');

class UserSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editUserModalParams: new ModalParams({
        component: this,
        key: 'editUserModalParams',
      }),
      deleteActioner: new Actioner({
        component: this,
        key: 'deleteActioner',
        axiosGetter: () => getAxios('admin'),
        method: 'delete',
        itemName: 'user',
        ItemKlass: User,
        successMessageGetter: user =>
          `User ${this.props.user.email} deleted successfully`,
        successCallback: (user) => {
          this.props.dispatch(push('/users'));
        },
        errorMessageGetter: error =>
          `Failed to delete User ${this.props.user.email}`,
      }),
    };
  }

  props: any;
  state: any;

  handleClickDelete = () => {
    this.state.deleteActioner.do(`/users/${this.props.user.id}.json`);
  }

  render() {
    const { user } = this.props;
    const details = [{
      title: 'Email',
      value: user.email,
    }, {
      title: 'Created At',
      value: (
        <CreatedAt
          createdAt={user.created_at}
          inline
        />
      ),
    }, {
      title: 'Token',
      value: user.authentication_token,
      size: 'lg',
    }];

    return (
      <div className={styles.Component}>
        <EditUserModal
          key={this.state.editUserModalParams.uuid}
          modalParams={this.state.editUserModalParams}
          user={this.props.user}
          onSuccess={this.props.loadItem}
        />
        <Row>
          <Col md={12} className="actions-listing">
            <Button shape="circle" icon="reload" onClick={this.props.loadItem} />
          </Col>
          <Col md={12} className="pull-right actions-listing">
            <Button shape="circle" onClick={this.state.editUserModalParams.show} icon="edit" type="primary" />
            <Popconfirm
              title="Are you sure？"
              okText="Yes"
              cancelText="Cancel"
              onConfirm={this.handleClickDelete}
            >
              <Button icon="close" shape="circle" type="danger" loading={this.state.deleteActioner.isLoading} />
            </Popconfirm>
          </Col>
        </Row>
        <Row className="ant-card-content">
          <DetailsContainer details={details} />
        </Row>
      </div>
    );
  }
}

const connector = connect(
  (reducer) => {
    return {};
  }
);

export default connector(UserSection);
