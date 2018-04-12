import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class EditorSection extends React.Component {
  constructor(props) {
    super(props)

    this.state = {};
  }

  render() {
    return (
      <div>
        <Editor />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(EditorSection);
