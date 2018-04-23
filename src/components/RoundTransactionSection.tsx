import * as React from 'react';
import { connect } from 'react-redux';
import { DetailsContainer, formatBooleanSign } from 'awry-utilities-2';
import { Row, Col, Button } from 'antd';

import RoundTransaction from '../models/RoundTransaction';

const styles = require('./RoundTransactionSection.scss');

class RoundTransactionSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  props: any;
  state: any;

  render() {
    const { roundTransaction } = this.props;
    const details = [{
      title: 'Player ID',
      value: roundTransaction.playerId,
    }, {
      title: 'Display Player ID',
      value: roundTransaction.displayPlayerId,
    }, {
      title: 'Round Closed?',
      value: formatBooleanSign(roundTransaction.isRoundClosed),
    }, {
      title: 'Game ID',
      value: roundTransaction.gameId,
    }, {
      title: 'Round ID',
      value: roundTransaction.roundId,
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

export default connector(RoundTransactionSection);
