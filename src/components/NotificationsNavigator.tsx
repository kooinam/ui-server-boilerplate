/* @flow */

import * as React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import { Badge, Icon, Popover, Menu, Spin } from 'antd';
import { ItemLoader, getAxios, TableParams, Actioner } from 'awry-utilities-2';
import { debounce } from 'lodash';

import { __NOTIFICATION_SERVER_URL__ } from '../admin_containers/AppPage';
import Activity from '../models/Activity';
import CreatedAt from './CreatedAt';

const styles = require('./NotificationsNavigator.scss');

class NotificationsNavigator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popoverVisible: false,
      itemLoader: new ItemLoader({
        component: this,
        key: 'itemLoader',
        axiosGetter: () => getAxios('track'),
        itemName: 'counter',
        ItemKlass: Object,
        url: '/activities/counter.json',
      }),
      tableParams: new TableParams({
        component: this,
        key: 'tableParams',
        axiosGetter: () => getAxios('track'),
        itemsName: 'activities',
        ItemKlass: Activity,
        url: `/activities/notifications.json`,
        filter: {
          s: ['notified_at DESC'],
        },
      }),
      actioner: new Actioner({
        component: this,
        key: 'actioner',
        axiosGetter: () => getAxios('track'),
        method: 'post',
        itemName: 'counter',
        ItemKlass: Object,
      }),
      count: null,
    };

    this.ref = React.createRef();
  }

  componentDidMount() {
    this.subscribe();
  }

  props: any;
  state: any;
  socket: any;
  ref: any;

  loadItem = () => {
    this.state.itemLoader.loadItem().then(() => {
      const counter = this.state.itemLoader.item;
      if (this.state.count === null || counter.count !== 0) {
        this.setState({
          count: counter.count,
        }, () => {
          this.loadItems();
        })
      }
    });
  }

  loadItems = () => {
    this.state.tableParams.loadItems().then(() => {
      if (this.state.popoverVisible) {
        this.state.actioner.do('/activities/read.json');
      }
    });
  }

  subscribe = () => {
    this.socket = io(__NOTIFICATION_SERVER_URL__);

    this.socket.on('notificationReceived', (data) => {
      this.loadItem();
    });
    this.socket.on('connect', () => {
      console.log('connected');
      this.socket.emit('subscribeToNotification', {
        subscriberId: this.props.currentUser.id,
      });
    });
    // socket.on('disconnect', () => {
    //   console.log('socket disconnected...');
    //   socket.open();
    // });
    // socket.on('reconnect', (quantity) => {
    //   console.log(quantity);
    // });
    // socket.on('connect', () => {
    //   console.log('connected');
    // });
  }

  render() {
    const { inline } = this.props;

    const count = this.state.itemLoader.item.count;
    const activities = this.state.tableParams.items;

    const menu = (
      <div
        className={styles.Menu}
        ref={this.ref}
      >
        <Spin spinning={this.state.tableParams.isLoading}>
          {
            activities.length === 0  && (
              <div className={styles.NoNotifcation}>
                No notification. :(
              </div>
            )
          }
          {
            activities.length > 0  && activities.map((activity) => {
              return (
                <div key={activity.uuid} className={`${styles.Activity} ${(activity.is_new) ? styles.NewActivity : ''}`}>
                  <CreatedAt createdAt={activity.created_at} inline />
                  <div className={styles.Content}>
                    {activity.getDescription(this.props.namespace)}
                  </div>
                  <hr className="hr" />
                </div>
              );
            })
          }
        </Spin>
      </div>
    );

    const content = (
      <Popover
        overlayClassName={styles.Popover}
        content={menu}
        visible={this.state.popoverVisible}
        onVisibleChange={
          (popoverVisible) => {
            this.setState({
              popoverVisible,
            }, () => {
              if (this.state.popoverVisible) {
                if (this.state.itemLoader.item.count && this.state.itemLoader.item.count > 0) {
                  this.state.actioner.do('/activities/read.json');
                  setTimeout(() => {
                    this.ref.current.scrollTop = 0;
                  }, 100);
                }
              }
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

    if (inline) {
      return (
        <Menu>
          <Menu.Item>
            {content}
          </Menu.Item>
        </Menu>
      );
    }

    return content;
  }
}

const connector = connect(
  (state) => {
    return {
      currentUser: state.AuthReducer.currentUser,
    };
  },
);

export default connector(NotificationsNavigator);
