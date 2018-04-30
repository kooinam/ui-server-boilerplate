import * as React from 'react';
import { Row, Col, Card } from 'antd';

import ActivitiesSection from '../components/ActivitiesSection';

const styles = require('./HomePage.scss');

class HomePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Row>
        <Col md={12}>
          <Card className="ant-card-lg" title="Activities" id="listing">
            <ActivitiesSection
              hideActions
            />
           </Card>
        </Col>
      </Row>
    );
  }
}

export default HomePage;