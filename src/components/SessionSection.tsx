import * as React from 'react';
import { connect } from 'react-redux';
import { DetailsContainer, Actioner, getAxios } from 'awry-utilities-2';
import { Row, Col, Button } from 'antd';
import { push } from 'react-router-redux';
import { Link } from 'react-router-dom';

import Session from '../models/Session';
import CreatedAt from './CreatedAt';

const styles = require('./SessionSection.scss');

class SessionSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  props: any;
  state: any;

  render() {
    const { session } = this.props;
    const details = [{
      title: 'Id',
      value: session.id,
    }, {
      title: 'Created At',
      value: (
        <CreatedAt
          createdAt={session.created_at}
          inline
        />
      ),
    }, {
      title: 'User',
      value: (
        <Link to={`/users/${session.user.id}`} target="_blank">
          {session.user.email}
        </Link>
      ),
    }, {
      title: 'Ip',
      value: session.ip,
    }, , {
      title: 'Description',
      value: session.description,
    }, {
      title: 'Locale',
      value: session.locale,
    }, {
      title: 'Browser',
      value: session.browser,
    }, {
      title: 'OS Architecture',
      value: session.os_architecture,
    }, {
      title: 'OS Family',
      value: session.os_family,
    }, {
      title: 'OS Version',
      value: session.os_version,
    }, {
      title: 'User Agent',
      value: session.ua,
      size: 'lg',
    }, {
      title: 'Activities',
      value: session.activities_count,
    }, {
      title: 'Duration(minutes)',
      value: session.duration,
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

export default connector(SessionSection);
