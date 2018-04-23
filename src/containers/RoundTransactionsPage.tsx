import * as React from 'react';
import { connect } from 'react-redux';
import { BaseRouteComponent, matchRouteParams } from 'awry-utilities-2';
import { Row, Col, Card, Input, Form, Button } from 'antd';
import { push } from 'react-router-redux';

const styles = require('./RoundTransactionsPage.scss');

class RoundTransactionsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  props: any;
  state: any;

  formatRoundTransactionPath = (playerId, gameId, roundId) => {
    return `/round_transactions/players/${playerId}/games/${gameId}/rounds/${roundId}`;
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((errors) => {
      if (errors) {
        return false;
      }

      const attributes = (form.getFieldsValue());

      this.props.dispatch(push(this.formatRoundTransactionPath(attributes.playerId, attributes.gameId, attributes.roundId)));

      return true;
    });
  }

  renderFilters = () => {
    const { form, matchedRoutes } = this.props;

    const playerId = matchRouteParams(matchedRoutes, 'playerId');
    const gameId = matchRouteParams(matchedRoutes, 'gameId');
    const roundId = matchRouteParams(matchedRoutes, 'roundId');

    return (
      <Row>
        <Col md={24}>
          <Form className={styles.Form} onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col md={8}>
                <Form.Item label="Player ID" hasFeedback>
                  {form.getFieldDecorator('playerId', {
                    rules: [
                      { required: true, message: 'Player ID is required' },
                    ],
                    initialValue: playerId,
                  })(
                    <Input
                      placeholder="Player ID"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="Game ID" hasFeedback>
                  {form.getFieldDecorator('gameId', {
                    rules: [
                      { required: true, message: 'Game ID is required' },
                    ],
                    initialValue: gameId,
                  })(
                    <Input
                      placeholder="Game ID"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="Round ID" hasFeedback>
                  {form.getFieldDecorator('roundId', {
                    rules: [
                      { required: true, message: 'Round ID is required' },
                    ],
                    initialValue: roundId,
                  })(
                    <Input
                      placeholder="Round ID"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col md={24}>
                <Button htmlType="submit" type="primary"  className="btn-primary">
                  Submit
                </Button>
              </Col>
            </Row>
           </Form>
        </Col>
        <Col md={24}>
          <hr className="ant-hr" />
        </Col>
      </Row>
    );
  }

  render() {
    const { matchedRoutes, formatRoundTransactionPath } = this.props;

    const playerId = matchRouteParams(matchedRoutes, 'playerId');
    const gameId = matchRouteParams(matchedRoutes, 'gameId');
    const roundId = matchRouteParams(matchedRoutes, 'roundId');

    return (
      <div className={styles.Container}>
        <Card className="ant-card-lg" title="Round Transactions" id="listing">
          {this.renderFilters()}
          <Row className={'ant-card-content'}>
            <Col md={12} className="actions-listing" />
            <Col md={12} className="pull-right actions-listing" />
          </Row>
          <Row className={'ant-card-content'}>
            <Col md={24}>
              <BaseRouteComponent
                {...this.props}
                formatRoundTransactionPath={this.formatRoundTransactionPath}
                playerId={playerId}
                gameId={gameId}
                roundId={roundId}
                key={roundId}
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

export default connector(Form.create()(RoundTransactionsPage));
