import * as React from 'react';
import { Badge, Icon } from 'antd';

const styles = require('./HomePage.scss');

class HomePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.Container}>
        Home
        <Badge count={5}>
          <a href="#" className="head-example" />
        </Badge>
      </div>
    );
  }
}

export default HomePage;