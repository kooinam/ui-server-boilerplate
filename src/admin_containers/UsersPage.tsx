import * as React from 'react';
import { connect } from 'react-redux';
import { ModalParams, TableParams, getAxios, CustomPagination, ErrorContainer, FiltersContainer, Actioner } from 'awry-utilities-2';
import { Row, Col, Card, Button, Table, Popconfirm, Tag } from 'antd';
import { debounce } from 'lodash';
import { push } from 'react-router-redux';
import { Link } from 'react-router-dom';

import User from '../models/User';
import NewUserModal from '../admin_components/NewUserModal';
import CreatedAt from '../components/CreatedAt';

const styles = require('./UsersPage.scss');

class UsersPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newUserModalParams: new ModalParams({
        component: this,
        key: 'newUserModalParams',
      }),
      tableParams: new TableParams({
        component: this,
        key: 'tableParams',
        axiosGetter: () => getAxios('admin'),
        itemsName: 'users',
        ItemKlass: User,
        url: '/users.json',
        filter: {
          s: ['email ASC'],
        },
      }),
      deleting: [],
      deleteActioner: new Actioner({
        component: this,
        key: 'deleteActioner',
        axiosGetter: () => getAxios('admin'),
        method: 'delete',
        itemName: 'user',
        ItemKlass: User,
        /* eslint-disable no-unused-vars */
        successMessageGetter: (user, key) =>
          `User ${key.email} deleted successfully`,
        successCallback: (user, key) => {
          const deleting = this.state.deleting;
          deleting.splice(deleting.indexOf(key.id), 1);
          const tableParams = this.state.tableParams;
          tableParams.items = tableParams.items.filter((item) => {
            return item.id !== key.id;
          });

          this.setState({
            deleting,
            tableParams,
          });
        },
        errorCallback: (error, key) => {
          const deleting = this.state.deleting;
          deleting.splice(deleting.indexOf(key.id), 1);

          this.setState({
            deleting,
          });
        },
        errorMessageGetter: (error, key) =>
          `Failed to delete User ${key.email}`,
        /* eslint-enable no-unused-vars */
      }),
    };

    this.loadItems = this.state.tableParams.loadItems;
    this.loadSearchItems = debounce(this.loadItems, 500);
  }

  componentDidMount() {
    this.loadItems();
  }

  props: any;
  state: any;
  loadItems: any;
  loadSearchItems: any;

  handleSearch = (key, value) => {
    const tableParams = this.state.tableParams;
    if (key) {
      tableParams.filter[key] = value;
    }
    tableParams.pagination.current = 1;
    this.setState({
      tableParams,
    }, () => {
      this.loadSearchItems();
    });
  }

  handleClickDeleteItem = (record) => {
    const deleting = this.state.deleting;
    deleting.push(record.id);

    this.setState({
      deleting,
    }, () => {
      this.state.deleteActioner.do(`/users/${record.id}.json`, null, {
        id: record.id,
        email: record.email,
      });
    });
  }

  renderItems = () => {
    if (this.state.tableParams.isError) {
      return (
        <ErrorContainer
          key={this.state.tableParams.uuid}
          spinning={this.state.tableParams.isLoading}
          onRetry={this.loadItems}
        />
      );
    }

    const columns = [{
      className: '',
      width: '20%',
      title: 'Created At',
      key: 'created_at',
      render: (value, record) => {
        return (
          <CreatedAt createdAt={record.created_at} />
        );
      },
    }, {
      className: '',
      width: '60%',
      title: 'Email',
      key: 'email',
      render: (value, record) => {
        return (
          <Link to={`/admin/users/${record.id}`}>
            {record.email}
          </Link>
        );
      },
    }, {
      className: '',
      width: '10%',
      title: 'Role',
      key: 'role',
      render: (value, record) => {
        return (
          <Tag>
            {record.role}
          </Tag>
        );
      },
    }, {
      className: 'ant-td-center',
      width: '10%',
      title: '',
      key: 'action',
      render: (record) => {
        return (
          <div className="actions-listing">
            <Button
              type="primary"
              icon="eye"
              shape="circle"
              onClick={
                () => {
                  this.props.dispatch(push(`/admin/users/${record.id}`));
                }
              }
            />
            <Popconfirm
              title="Are you sure？"
              okText="Yes"
              cancelText="Cancel"
              onConfirm={
                () => {
                  this.handleClickDeleteItem(record);
                }
              }
            >
              <Button icon="close" shape="circle" type="danger" loading={this.state.deleting.indexOf(record.id) !== -1} />
            </Popconfirm>
          </div>
        );
      },
    }];

    const locale = {
      emptyText: 'No User found',
    };

    return (
      <Table
        columns={columns}
        dataSource={this.state.tableParams.items}
        bordered
        locale={locale}
        pagination={false}
        rowKey="id"
        loading={this.state.tableParams.isLoading}
        scroll={{
          x: columns.length * 100,
        }}
      />
    );
  }

  renderFilters = () => {
    const filters = [{
      name: 'Email',
      field: 'email',
    }, {
      name: 'Created At From',
      field: 'created_at_gteq',
      exact: true,
      type: 'date',
    }, {
      name: 'Created At To',
      field: 'created_at_lteq',
      exact: true,
      type: 'date',
    }];
    const sorting = [{
      key: 'email ASC',
      label: 'Email (ASC)',
    }, {
      key: 'email DESC',
      label: 'Email (DESC)',
    }, {
      key: 'created_at ASC',
      label: 'Created At (ASC)',
    }, {
      key: 'created_at DESC',
      label: 'Created At (DESC)',
    }];

    return (
      <FiltersContainer
        filters={filters}
        sorting={sorting}
        onSearch={this.handleSearch}
      />
    );
  }

  render() {
    return (
      <div className={styles.Container}>
        <Card className="ant-card-lg" title="Users" id="listing">
          <NewUserModal
            {...this.state.newUserModalParams.churn()}
            onSuccess={
              (user) => {
                this.props.dispatch(push(`/admin/users/${user.id}`));
              }
            }
            user={new User()}
          />
          {this.renderFilters()}
          <Row className={'ant-card-content'}>
            <Col md={12} className="actions-listing">
              <Button shape="circle" icon="reload" onClick={this.loadItems} />
            </Col>
            <Col md={12} className="pull-right actions-listing">
              <Button onClick={this.state.newUserModalParams.show} icon="plus" type="primary">
                User
              </Button>
            </Col>
          </Row>
          <Row className={'ant-card-content'}>
            <Col md={24}>
              {this.renderItems()}
            </Col>
          </Row>
          <Row>
            <Col md={24} className={'pull-right'}>
              <CustomPagination
                key={this.state.tableParams.uuid}
                tableParams={this.state.tableParams}
                loadItems={this.loadItems}
                anchor="listing"
              />
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

const connector = connect(
  (reducer) => {
    return {};
  }
);

export default connector(UsersPage);