/* @flow */

import * as React from 'react';
import { connect } from 'react-redux';
import * as io from 'socket.io-client';
import { Badge, Icon, Popover, Menu } from 'antd';

const styles = require('./NotificationsNavigator.scss');

class NotificationsNavigator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popoverVisible: false,
    };
  }

  componentDidMount() {
    this.subscribe();
  }

  props: any;
  state: any;

  subscribe = () => {
    const socket = io('http://localhost:9009');

    socket.on('timer', (timestamp) => {
      console.log(timestamp);
    });
    socket.emit('subscribeToTimer', 1000);
  }

  render() {
    const count = 0;

    const menu = (
      <Menu selectedKeys={[]} className={styles.Menu}>
        <Menu.Item>
          <a role="button">
            Log Out
          </a>
        </Menu.Item>
      </Menu>
    );

    return (
      <Popover
        overlayClassName={styles.Popover}
        content={menu}
        placement="bottomRight"
        visible={this.state.popoverVisible}
        onVisibleChange={
          (popoverVisible) => {
            this.setState({
              popoverVisible,
            });
          }
        }
      >
        <a className={styles.Component}>
          <Badge count={count} overflowCount={99}>
            <Icon type="bell" />
          </Badge>
        </a>
      </Popover>
    );
  }
}

const connector = connect(
  (state) => {
    return {};
  },
);

export default connector(NotificationsNavigator);
