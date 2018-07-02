import * as React from 'react';
import { connect } from 'react-redux';
import { TableParams, getAxios, CustomPagination, ErrorContainer, FiltersContainer } from 'awry-utilities-2';
import { Row, Col, Card, Button, Table } from 'antd';
import { debounce } from 'lodash';
import { push } from 'react-router-redux';
import { Link } from 'react-router-dom';

import Session from '../models/Session';
import CreatedAt from '../components/CreatedAt';

const styles = require('./SessionsPage.scss');

class SessionsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tableParams: new TableParams({
        component: this,
        key: 'tableParams',
        axiosGetter: () => getAxios('admin'),
        itemsName: 'sessions',
        ItemKlass: Session,
        url: '/sessions.json',
        filter: {
          s: ['created_at DESC'],
        },
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
      title: 'Id',
      key: 'id',
      render: (value, record) => {
        return (
          <Link to={`/admin/sessions/${record.id}`}>
            {record.id}
          </Link>
        );
      },
    }, {
      className: '',
      width: '10%',
      title: 'Created At',
      key: 'created_at',
      render: (value, record) => {
        return (
          <div>
            <CreatedAt createdAt={record.created_at} />
          </div>
        );
      },
    }, {
      className: '',
      width: '10%',
      title: 'User',
      key: 'user',
      render: (value, record) => {
        return (
          <Link to={`/admin/users/${record.user.id}`} target="_blank">
            {record.user.email}
          </Link>
        );
      },
    }, {
      className: '',
      width: '10%',
      title: 'Ip',
      key: 'ip',
      render: (value, record) => {
        return (
          <div>
            {record.ip}
          </div>
        );
      },
    }, {
      className: '',
      width: '20%',
      title: 'User Agent',
      key: 'ua',
      render: (value, record) => {
        return (
          <div>
            {record.ua}
          </div>
        );
      },
    }, {
      className: '',
      width: '10%',
      title: 'Locale',
      key: 'locale',
      render: (value, record) => {
        return (
          <div>
            {record.locale}
          </div>
        );
      },
    }, {
      className: '',
      width: '10%',
      title: 'Activities / Duration (minutes)',
      key: 'activities_count_duration',
      render: (value, record) => {
        return (
          <div>
            {record.activities_count} / {record.duration}
          </div>
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
                  this.props.dispatch(push(`/admin/sessions/${record.id}`));
                }
              }
            />
          </div>
        );
      },
    }];

    const locale = {
      emptyText: 'No Session found',
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
      name: 'Description',
      field: 'description',
      exact: true,
    }, {
      name: 'Ip',
      field: 'ip',
      exact: true,
    }];
    const sorting = [{
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
        selectedSort={sorting[1]}
      />
    );
  }

  render() {
    return (
      <div className={styles.Container}>
        <Card className="ant-card-lg" title="Sessions" id="listing">
          {this.renderFilters()}
          <Row className={'ant-card-content'}>
            <Col md={12} className="actions-listing">
              <Button shape="circle" icon="reload" onClick={this.loadItems} />
            </Col>
            <Col md={12} className="pull-right actions-listing" />
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

export default connector(SessionsPage);