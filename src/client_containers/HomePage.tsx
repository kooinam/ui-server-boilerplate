import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col, Tag } from 'antd';

const styles = require('./HomePage.scss');

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 1,
    };
  }

  props: any;
  state: any;

  handleClickCounter = () => {
    let { counter } = this.state;

    counter += 1;

    // use set state to trigger changes
    this.setState({
      counter,
    });
  }

  render() {
    const { counter } = this.state;

    return (
      <div
        className={styles.Container}
      >
        <Row>
          <Col md={12}>
            <a
              href="https://ant.design/docs/react/introduce"
              target="_blank"
            >
              FIND ME HERE!!!
            </a>
          </Col>
          <Col md={12}>
            <Tag
              color="red"
            >
              {counter}
             </Tag>
            <Button
              onClick={this.handleClickCounter}
              type="primary"
            >
              ++
            </Button>
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

export default connector(HomePage);