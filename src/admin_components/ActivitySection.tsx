import * as React from 'react';
import { connect } from 'react-redux';
import { DetailsContainer, Actioner } from 'awry-utilities-2';
import { Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';

import Activity from '../models/Activity';
import CreatedAt from '../components/CreatedAt';
import { ExtrasSection } from './ActivityExtrasModal';
import { ActorChangesSection } from './ActivityActorChangesModal';

const styles = require('./ActivitySection.scss');

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
    }, {
      title: 'Created At',
      value: (
        <CreatedAt
          createdAt={activity.created_at}
          inline
        />
      ),
    }, {
      title: 'Last Tracked At',
      value: (
        <CreatedAt
          createdAt={activity.last_tracked_at}
          inline
        />
      ),
    }, {
      title: 'Description',
      value: (
        <div
          className={styles.Description}
          dangerouslySetInnerHTML={{
            __html: activity.description
          }}
        />
      ),
      size: 'lg',
    }, {
      title: 'Session',
      value: (
        <div>
          {
            activity.session && (
              <Link to={`/admin/sessions/${activity.session.id}`} target="_blank">
                {activity.session.id}
              </Link>
            )
          }
        </div>
      ),
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
            <Button shape="circle" icon="reload" onClick={this.props.loadItem} />
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
