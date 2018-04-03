/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { Button } from 'antd';
import { ModalParams } from 'awry-utilities';

import type { Reducer } from '../../types';
import styles from './NewSheetNavigator.scss';
import { showSignInModal } from '../actions/auth';
import NewSheetModal from './NewSheetModal';
import Sheet from '../models/Sheet';

class NewSheetNavigator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalParams: new ModalParams({
        component: this,
        key: 'modalParams',
      }),
    };
  }

  handleClickNewSheet = () => {
    const { currentUser } = this.props;

    if (!currentUser) {
      this.props.dispatch(showSignInModal(() => {
        this.state.modalParams.show();
      }));
    } else {
      this.state.modalParams.show();
    }
  }

  render() {
    const { authState } = this.props;
    const { modalParams } = this.state;

    let button = null;
    if (authState) {
      button = (
        <Button
          icon="plus"
          className={`btn-primary ${styles.Component}`}
          onClick={this.handleClickNewSheet}
        />
      );
    }

    return (
      <div>
        <NewSheetModal
          key={modalParams.uuid}
          modalParams={modalParams}
          sheet={new Sheet()}
        />
        {button}
      </div>
    );
  }
}

/* eslint-disable no-unused-vars */
const connector: Connector<{}, Props> = connect(
  (reducer: Reducer) => {
    return {
      currentUser: reducer.AuthReducer.currentUser,
      authState: reducer.AuthReducer.state,
    };
  },
);
/* eslint-enable no-unused-vars */

export default connector(NewSheetNavigator);
