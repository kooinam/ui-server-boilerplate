import * as React from 'react';
import { connect } from 'react-redux';
import { DetailsContainer } from 'awry-utilities-2';
import { Row, Col, Button, Tag } from 'antd';

import Activity from '../models/Activity';
import CreatedAt from '../components/CreatedAt';

const styles = require('./ActivitySection.scss');

class ExtrasSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  props: any;
  state: any;

  render() {
    const { activity } = this.props;

    return (
      <React.Fragment>
        {activity.extras.map((extra) => {
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
        })}
      </React.Fragment>
    )
  }
}

class ActorChangesSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  props: any;
  state: any;

  render() {
    const { activity } = this.props;

    return (
      <React.Fragment>
        {activity.actor_changes.map((actorChange) => {
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
        })}
      </React.Fragment>
    )
  }
}

class ActivitySection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  props: any;
  state: any;

  handleClickDelete = () => {
    this.state.deleteActioner.do(`/activities/${this.props.activity.id}.json`);
  }

  render() {
    const { activity } = this.props;

    const details = [{
      title: 'Id',
      value: activity.id,
      size: 'lg',
    }, {
      title: 'Created At',
      value: (
        <CreatedAt
          createdAt={activity.created_at}
          inline
        />
      ),
      size: 'lg',
    }, {
      title: 'Key',
      value: (
        <Tag color="108ee9">
          {activity.key}
        </Tag>
      ),
      size: 'lg',
    }, {
      title: 'Description',
      value: activity.getDescription('admin'),
      size: 'lg',
    }, {
      title: 'Extras',
      value: (
        <ExtrasSection activity={activity} />
      ),
      size: 'lg',
    }, {
      title: 'Changes',
      value: (
        <ActorChangesSection activity={activity} />
      ),
      size: 'lg',
    }];

    return (
      <div className={styles.Component}>
        <Row>
          <Col md={12} className="actions-listing">
            {
              this.props.loadItem && (
                <Button shape="circle" icon="reload" onClick={this.props.loadItem} />
              )
            }
          </Col>
          <Col md={12} className="pull-right actions-listing" />
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

export default connector(ActivitySection);
