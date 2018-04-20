import * as React from 'react';

const styles = require('./HomePage.scss');

class HomePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.Container}>
        Home
      </div>
    );
  }
}

export default HomePage;