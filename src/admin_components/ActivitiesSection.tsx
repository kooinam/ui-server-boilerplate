import * as React from 'react';
import { connect } from 'react-redux';
import { ModalParams, TableParams, getAxios, CustomPagination, ErrorContainer, FiltersContainer } from 'awry-utilities-2';
import { Row, Col, Button, Table, Tag, Checkbox } from 'antd';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';

import Activity from '../models/Activity';
import CreatedAt from '../components/CreatedAt';
import ActivityModal from './ActivityModal';
import { tagColor } from '../utils/UtilityManager';

const styles = require('./ActivitiesSection.scss');

class ActivitiesSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activityModalParams: new ModalParams({
        component: this,
        key: 'activityModalParams',
      }),
      tableParams: new TableParams({
        component: this,
        key: 'tableParams',
        axiosGetter: () => getAxios('admin'),
        itemsName: 'activities',
        ItemKlass: Activity,
        url: (this.props.apiPrefix)? `/${this.props.apiPrefix}/activities.json` : '/activities.json',
        filter: {
          s: ['created_at DESC'],
        },
        paramsGetter: (tableParams) => {
          return {
            params: {
              recipient: this.props.recipient,
              q: tableParams.filter,
              per_page: tableParams.pagination.per_page,
              page: tableParams.pagination.current,
            },
          };
        },
      }),
      details: true,
      activity: new Activity(),
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

  handleChangeDetails = (e) => {
    this.setState({
      details: e.target.checked,
    });
  }

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
    const { link, hideActions, showKey } = this.props;

    if (this.state.tableParams.isError) {
      return (
        <ErrorContainer
          key={this.state.tableParams.uuid}
          spinning={this.state.tableParams.isLoading}
          onRetry={this.loadItems}
        />
      );
    }

    let descriptionWidth = 70;
    if (showKey) {
      descriptionWidth = descriptionWidth - 10;
    }

    const columns = [{
      className: '',
      width: '30%',
      title: 'Id',
      key: 'id',
      render: (value, record) => {
        if (link) {
          return (
            <Link to={(this.props.routePrefix) ? `/admin/${this.props.routePrefix}/activities/${record.id}` : `/admin/activities/${record.id}`}>
              {record.id}
            </Link>
          );
        }

        return (
          <Link
            to="#"
            onClick={
              () => {
                this.setState({
                  activity: record,
                }, () => {
                  this.state.activityModalParams.show();
                });
              }
            }
          >
            {record.id}
          </Link>
        );
      },
    }, {
      className: '',
      width: `${descriptionWidth}%`,
      title: 'Description',
      key: 'description',
      render: (value, record) => {
        return (
          <div>
            <CreatedAt createdAt={record.created_at} inline />
            {record.getDescription('admin')}
            {
              this.state.details && record.extras.map((extra) => {
                if (extra.category === 0) {
                  return (
                    <div key={extra.id}>
                      <Tag color="blue">
                        {extra.key}
                      </Tag>
                      <small>
                        {extra.getValue()}
                      </small>
                    </div>
                  );
                }
              })
            }
            {
              this.state.details && record.actor_changes.map((actorChange) => {
                return (
                  <div key={actorChange.id}>
                    <Tag color="#108ee9">
                      {actorChange.key}
                    </Tag>
                    <small>
                      {actorChange.getValue()}
                    </small>
                  </div>
                );
              })
            }
          </div>
        );
      },
    }];

    const key = {
      className: '',
      width: '10%',
      title: 'Key',
      key: 'key',
      render: (value, record) => {
        return (
          <Tag color={tagColor('type')}>
            {record.key}
          </Tag>
        );
      },
    };

    const action = {
      className: '',
      width: '10%',
      title: 'Actions',
      key: 'actions',
      render: (value, record) => {
        let sessionLink = null;
        if (record.session.id) {
          sessionLink = (
            <Link to={`/admin/sessions/${record.session.id}`} target="_blank">
              <u>
                Session
              </u>
            </Link>
          );
        }

        return (
          <div>
            {sessionLink}
            <br />
            <a
              onClick={
                () => {
                  this.setState({
                    extrasActivity: record,
                  }, () => {
                    this.state.extrasModalParams.show();
                  });
                }
              }
            >
              <u>
                Extras
              </u>
            </a>
            <br />
            <a
              onClick={
                () => {
                  this.setState({
                    actorChangesActivity: record,
                  }, () => {
                    this.state.actorChangesModalParams.show();
                  });
                }
              }
            >
              <u>
                Changes
              </u>
            </a>
           </div>
        );
      },
    };

    if (showKey) {
      columns.push(key);
    }
    // if (!hideActions) {
    //   columns.push(action);
    // }

    const locale = {
      emptyText: 'No Activity found',
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
      name: 'Key',
      field: 'key',
      exact: true,
    }, {
      name: 'Actor Type',
      field: 'actor.actor_type',
      exact: true,
    }, {
      name: 'Actor ID',
      field: 'actor.actor_id',
      exact: true,
    }, {
      name: 'Extras',
      field: 'extras_field',
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
    const { renderFilters } = this.props;

    return (
      <div className={styles.Component}>
        <ActivityModal
          {...this.state.activityModalParams.churn()}
          activity={this.state.activity}
        />
        <Tag style={{ display: 'none' }} />
        {renderFilters && this.renderFilters()}
        <Row className={'ant-card-content'}>
          <Col md={12} className="actions-listing">
            <Button shape="circle" icon="reload" onClick={this.loadItems} />
          </Col>
          <Col md={12} className="pull-right actions-listing">
            <Checkbox
              onChange={(e) => this.handleChangeDetails(e)}
              checked={this.state.details}
            >
              Details?
            </Checkbox>
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
    );
  }
}

const connector = connect(
  (reducer) => {
    return {};
  }
);

export default connector(ActivitiesSection);
