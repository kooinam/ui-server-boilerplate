import * as React from 'react';
import { connect } from 'react-redux';
import { Card } from 'antd';

import Activity from '../models/Activity';
import ActivitiesSection from '../admin_components/ActivitiesSection';

const styles = require('./ActivitiesPage.scss');

class ActivitiesPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  props: any;
  state: any;

  render() {
    return (
      <div className={styles.Container}>
        <Card className="ant-card-lg" title="Activities" id="listing">
          <ActivitiesSection
            link
            renderFilters
            showKey
            apiPrefix={''}
            routePrefix={''}
          />
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

export default connector(ActivitiesPage);
