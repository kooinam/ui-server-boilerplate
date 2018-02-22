/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { TableParams, getAxios, FiltersContainer, CustomPagination, ErrorContainer } from 'awry-utilities';
import debounce from 'lodash.debounce';
import { Card, Table, Row, Col, Button } from 'antd';

import styles from './LogsPage.scss';
import Log from '../models/Log';

class LogsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableParams: new TableParams({
        component: this,
        key: 'tableParams',
        axiosGetter: () => getAxios('insights'),
        itemsName: 'logs',
        ItemKlass: Log,
        url: '/logs.json',
        filter: {
          s: ['created_at DESC'],
        },
        paramsGetter: (tableParams) => {
          return {
            params: {
              id: tableParams.filter.id,
              log_action: tableParams.filter.log_action,
              field_names: (tableParams.filter.field_names) ? [tableParams.filter.field_names] : null,
              data_fields: (tableParams.filter.data_fields) ? [tableParams.filter.data_fields] : null,
              log_type: tableParams.filter.log_type,
              log_id: tableParams.filter.log_id,
              q: tableParams.filter,
              per_page: tableParams.pagination.per_page,
              page: tableParams.pagination.current,
            },
          };
        },
      }),
    };

    this.renderFilters = this.renderFilters.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.loadItems = this.state.tableParams.loadItems.bind(this);
    this.loadSearchItems = debounce(this.loadItems, 500);
    this.renderItems = this.renderItems.bind(this);
  }

  componentDidMount = () => {
    this.loadItems();
  }

  props: Props;

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
      className: 'ant-td-center',
      width: '10%',
      title: 'Time',
      key: 'created_at',
      render: (value, record) => {
        return (
          <Link to={`/mat/logs/${record.id}`}>
            {formatDate(record.created_at)}
            <br />
            <small>
              {formatTime(record.created_at)}
            </small>
          </Link>
        );
      },
    }, {
      className: '',
      width: '15%',
      title: 'Action',
      key: 'action',
      render: (value, record) => {
        return (
          <div>
            {record.action}
          </div>
        );
      },
    }, {
      className: 'ant-td-padding-sm',
      width: '15%',
      title: 'Done by',
      key: 'actioner',
      render: (value, record) => {
        if (!record.is_system) {
          return (
            <Link to={`/mat/users/${record.actioner_username}`} target="_blank">
              {record.actioner_username}
            </Link>
          );
        }
        return (
          <div>
            System
          </div>
        );
      },
    }, {
      className: 'ant-td-padding-sm',
      width: '15%',
      title: 'Target',
      key: 'target',
      render: (value, record) => {
        return (
          <div>
            {`${record.type} #${record.actionee_id}`}
          </div>
        );
      },
    }, {
      className: '',
      width: '15%',
      title: 'Changes',
      key: 'log_changes',
      render: (value, record) => {
        const logChanges = Object.keys(record.log_changes).map((key) => {
          return (
            <Row key={key} gutter={16}>
              <Col span={12}>
                <span className="ant-label ant-label-block">
                  {key}
                </span>
              </Col>
              <Col span={12}>
                <span className="ant-texter-sm">
                  {record.log_changes[key]}
                </span>
              </Col>
            </Row>
          );
        });
        return (
          <div>
            {logChanges}
          </div>
        );
      },
    }, {
      className: '',
      width: '20%',
      title: 'Remarks',
      key: 'remark',
      render: (value, record) => {
        return (
          <div className="ant-texter">
            {record.remarks}
          </div>
        );
      },
    }, {
      className: 'ant-td-center',
      width: '10%',
      title: '',
      key: 'actions',
      render: (record) => {
        return (
          <div className="actions-listing">
            <Button
              type="primary"
              icon="eye"
              shape="circle"
              onClick={
                () => {
                  this.props.dispatch(push(`/mat/logs/${record.id}`));
                }
              }
            />
          </div>
        );
      },
    }];

    const locale = {
      emptyText: 'No Log found',
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
      />
    );
  }

  renderFilters = () => {
    const filters = [{
      name: 'From',
      field: 'created_at_gteq',
      exact: true,
      type: 'date',
    }, {
      name: 'To',
      field: 'created_at_lteq',
      exact: true,
      type: 'date',
    }, {
      name: 'ID',
      field: 'id',
      exact: true,
    }, {
      name: 'Action',
      field: 'log_action',
      exact: true,
    }, {
      name: 'Target Type',
      field: 'log_type',
      exact: true,
    }, {
      name: 'Target Id',
      field: 'log_id',
      exact: true,
    }, {
      name: 'Changes',
      field: 'field_names',
      exact: true,
    }, {
      name: 'Data',
      field: 'data_fields',
      exact: true,
    }];
    const sorting = [];

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
        <Card className="ant-card-lg" title="Logs" id="listing">
          {this.renderFilters()}
          <Row className={'ant-card-content'}>
            <Col md={12} className="actions-listing">
              <Button shape="circle" icon="reload" onClick={this.loadItems} />
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

/* eslint-disable no-unused-vars */
const connector: Connector<{}, Props> = connect(
  (reducer: Reducer) => ({ }),
);
/* eslint-enable no-unused-vars */

export default connector(LogsPage);

