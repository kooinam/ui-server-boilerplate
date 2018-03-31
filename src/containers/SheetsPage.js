/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { BaseRouteComponent, matchRouteParams, renderActions, ModalParams } from 'awry-utilities';
import { Button } from 'antd';

import styles from './SheetsPage.scss';
import SheetsSection from '../components/SheetsSection';
import NewSheetModal from '../components/NewSheetModal';
import Sheet from '../models/Sheet';

class SheetsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newSheetModalParams: new ModalParams({
        component: this,
        key: 'newSheetModalParams',
      }),
    };
  }

  renderActions = (stash) => {
    const { newSheetModalParams } = this.state;
    const actions = [{
      component: (
        <Button key="post" icon="plus" className="btn-primary" onClick={newSheetModalParams.show}>
          Sheet
        </Button>
      ),
      canAccess: stash.canPost(),
    }];

    return renderActions(actions);
  }

  render() {
    const { stash, baseStyles, urlPrefix, matchedRoutes } = this.props;
    const { newSheetModalParams } = this.state;
    const sheetId = matchRouteParams(matchedRoutes, 'sheetId');

    return (
      <div className={styles.Container}>
        <NewSheetModal
          key={newSheetModalParams.uuid}
          modalParams={newSheetModalParams}
          sheet={new Sheet()}
          stash={stash}
        />
        <div className={styles.Sheets}>
          <div className={`${baseStyles.Header} ${baseStyles.HeaderOne}`}>
            <div className={baseStyles.Actions}>
              {this.renderActions(stash)}
            </div>
            <div className={baseStyles.Cover}>
              <img src={stash.cover_image_attachment.thumb_url} />
            </div>
            <div className={baseStyles.Title}>
              {stash.name}
              's Sheets
            </div>
          </div>
        </div>
        <hr className="hr" />
        <SheetsSection stash={stash} urlPrefix={this.props.urlPrefix} />
        <BaseRouteComponent {...this.props} matchedRoutes={this.props.matchedRoutes} stash={stash} urlPrefix={urlPrefix} key={sheetId} />
      </div>
    );
  }
}

/* eslint-disable no-unused-vars */
const connector: Connector<{}, Props> = connect(
  (reducer) => ({}),
);
/* eslint-enable no-unused-vars */

export default connector(SheetsPage);
