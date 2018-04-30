import * as React from 'react';
import { connect } from 'react-redux';
import { ModalParams, TableParams, getAxios, CustomPagination, ErrorContainer } from 'awry-utilities-2';
import { Row, Col, Button, Table, Tag } from 'antd';
import { Link } from 'react-router-dom';

import Activity from '../models/Activity';
import CreatedAt from './CreatedAt';
import ActivityActorChangesModal from './ActivityActorChangesModal';
import ActivityExtrasModal from './ActivityExtrasModal';

const styles = require('./ActivitiesSection.scss');

class ActivitiesSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tableParams: new TableParams({
        component: this,
        key: 'tableParams',
        axiosGetter: () => getAxios('admin'),
        itemsName: 'activities',
        ItemKlass: Activity,
        url: '/activities.json',
        filter: {
          s: ['created_at DESC'],
          session_id: this.props.sessionId,
        },
      }),
      extrasActivity: new Activity(),
      extrasModalParams: new ModalParams({
        component: this,
        key: 'extrasModalParams',
      }),
      actorChangesActivity: new Activity(),
      actorChangesModalParams: new ModalParams({
        component: this,
        key: 'actorChangesModalParams',
      }),
    };

    this.loadItems = this.state.tableParams.loadItems;
  }

  componentDidMount() {
    this.loadItems();
  }

  props: any;
  state: any;
  loadItems: any;

  renderItems = () => {
    const { targetNotBlank } = this.props;

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
        if (targetNotBlank) {
          return (
            <Link to={`/activities/${record.id}`}>
              {record.id}
            </Link>
          );
        }

        return (
          <Link to={`/activities/${record.id}`} target="_blank">
            {record.id}
          </Link>
        );
      },
    }, {
      className: '',
      width: (!this.props.hideActions) ? '70%' : '80%',
      title: 'Description',
      key: 'description',
      render: (value, record) => {
        return (
          <div>
            <CreatedAt createdAt={record.created_at} inline />
            <div
              dangerouslySetInnerHTML={{
                __html: record.description
              }}
            />
          </div>
        );
      },
    }];

    const action = {
      className: '',
      width: '10%',
      title: 'Actions',
      key: 'actions',
      render: (value, record) => {
        let sessionLink = null;
        if (record.session.id) {
          sessionLink = (
            <Link to={`/sessions/${record.session.id}`} target="_blank">
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

    if (!this.props.hideActions) {
      columns.push(action);
    }

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
      />
    );
  }

  render() {
    return (
      <div className={styles.Component}>
        <ActivityExtrasModal
          {...this.state.extrasModalParams.churn()}
          activity={this.state.extrasActivity}
        />
        <ActivityActorChangesModal
          {...this.state.actorChangesModalParams.churn()}
          activity={this.state.actorChangesActivity}
        />
        <Tag style={{ display: 'none' }} />
        <Row className={'ant-card-content'}>
          <Col md={12} className="actions-listing">
            <Button shape="circle" icon="reload" onClick={this.loadItems} />
          </Col>
          <Col md={12} />
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
