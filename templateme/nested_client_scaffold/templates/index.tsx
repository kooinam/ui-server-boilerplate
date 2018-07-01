import * as React from 'react';
import { connect } from 'react-redux';
import { ModalParams, TableParams, getAxios, CustomPagination, ErrorContainer, FiltersContainer, Actioner } from 'awry-utilities-2';
import { Row, Col, Card, Button, Table, Popconfirm } from 'antd';
import { debounce } from 'lodash';

import <%= name.capitalize() %> from '../models/<%= name.capitalize() %>';
import New<%= name.capitalize() %>Modal from '../client_components/New<%= name.capitalize() %>Modal';
import Edit<%= name.capitalize() %>Modal from '../client_components/Edit<%= name.capitalize() %>Modal';

const styles = require('./<%= name.capitalize().pluralize() %>Section.scss');

class <%= name.capitalize().pluralize() %>Section extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      new<%= name.capitalize() %>ModalParams: new ModalParams({
        component: this,
        key: 'new<%= name.capitalize() %>ModalParams',
      }),
      tableParams: new TableParams({
        component: this,
        key: 'tableParams',
        axiosGetter: () => getAxios('<%= axiosName %>'),
        itemsName: '<%= name.pluralize() %>',
        ItemKlass: <%= name.capitalize() %>,
        url: `/${this.props.apiPrefix}/<%= name.pluralize() %>.json`,
        filter: {
          s: ['<%= sortField %> ASC'],
        },
      }),
      edit<%= name.capitalize() %>: new <%= name.capitalize() %>(),
      edit<%= name.capitalize() %>ModalParams: new ModalParams({
        component: this,
        key: 'edit<%= name.capitalize() %>ModalParams',
      }),
      deleting: [],
      deleteActioner: new Actioner({
        component: this,
        key: 'deleteActioner',
        axiosGetter: () => getAxios('<%= axiosName %>'),
        method: 'delete',
        itemName: '<%= name %>',
        ItemKlass: <%= name.capitalize() %>,
        /* eslint-disable no-unused-vars */
        successMessageGetter: (<%= name.camelcase() %>, key) =>
          `<%= name.capitalize().split() %> ${key.<%= titleField %>} deleted successfully`,
        successCallback: (<%= name.camelcase() %>, key) => {
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
          `Failed to delete <%= name.split().capitalize() %> ${key.<%= titleField %>}`,
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
      this.state.deleteActioner.do(`/${this.props.apiPrefix}/<%= name.pluralize() %>/${record.<%= apiField %>}.json`, null, {
        id: record.id,
        <%= titleField %>: record.<%= titleField %>,
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
      width: '90%',
      title: '<%= titleField.split().capitalize() %>',
      key: '<%= titleField %>',
      render: (value, record) => {
        return (
          <div>
            {record.<%= titleField %>}
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
              icon="edit"
              shape="circle"
              onClick={
                () => {
                  this.setState({
                    edit<%= name.capitalize() %>: record,
                  }, () => {
                    this.state.edit<%= name.capitalize() %>ModalParams.show();
                  });
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
      emptyText: 'No <%= name.split().capitalize() %> found',
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
      name: '<%= titleField.split().capitalize() %>',
      field: '<%= titleField %>',
    }];
    const sorting = [{
      key: '<%= sortField %> ASC',
      label: '<%= sortField.split().capitalize() %> (ASC)',
    }, {
      key: '<%= sortField %> DESC',
      label: '<%= sortField.split().capitalize() %> (DESC)',
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
      <div className={styles.Component}>
        <div id="listing">
          <New<%= name.capitalize() %>Modal
            {...this.state.new<%= name.capitalize() %>ModalParams.churn()}
            onSuccess={
              (<%= name.camelcase() %>) => {
                this.loadItems();
              }
            }
            <%= name.camelcase() %>={new <%= name.capitalize() %>()}
            apiPrefix={this.props.apiPrefix}
          />
          <Edit<%= name.capitalize() %>Modal
            {...this.state.edit<%= name.capitalize() %>ModalParams.churn()}
            onSuccess={
              (<%= name.camelcase() %>) => {
                this.loadItems();
              }
            }
            <%= name.camelcase() %>={this.state.edit<%= name.capitalize() %>}
            apiPrefix={this.props.apiPrefix}
          />
          {this.renderFilters()}
          <Row className={'ant-card-content'}>
            <Col md={12} className="actions-listing">
              <Button shape="circle" icon="reload" onClick={this.loadItems} />
            </Col>
            <Col md={12} className="pull-right actions-listing">
              <Button onClick={this.state.new<%= name.capitalize() %>ModalParams.show} icon="plus" type="primary">
                <%= name.split().capitalize() %>
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
        </div>
      </div>
    );
  }
}

const connector = connect(
  (reducer) => {
    return {};
  }
);

export default connector(<%= name.capitalize().pluralize() %>Section);
