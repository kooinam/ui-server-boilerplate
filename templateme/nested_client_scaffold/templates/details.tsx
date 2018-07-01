import * as React from 'react';
import { connect } from 'react-redux';
import { ModalParams, DetailsContainer, Actioner, getAxios } from 'awry-utilities-2';
import { Row, Col, Button, Popconfirm } from 'antd';
import { push } from 'react-router-redux';

import <%= name.capitalize() %> from '../models/<%= name.capitalize() %>';
import Edit<%= name.capitalize() %>Modal from './Edit<%= name.capitalize() %>Modal';

const styles = require('./<%= name.capitalize() %>Section.scss');

class <%= name.capitalize() %>Section extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit<%= name.capitalize() %>ModalParams: new ModalParams({
        component: this,
        key: 'edit<%= name.capitalize() %>ModalParams',
      }),
      deleteActioner: new Actioner({
        component: this,
        key: 'deleteActioner',
        axiosGetter: () => getAxios('<%= axiosName %>'),
        method: 'delete',
        itemName: '<%= name %>',
        ItemKlass: <%= name.capitalize() %>,
        successMessageGetter: <%= name.camelcase() %> =>
          `<%= name.capitalize().split() %> ${this.props.<%= name.camelcase() %>.<%= titleField %>} deleted successfully`,
        successCallback: (<%= name.camelcase() %>) => {
          this.props.dispatch(push('<%= pathPrefix %>/<%= name.pluralize() %>'));
        },
        errorMessageGetter: error =>
          `Failed to delete <%= name.split().capitalize() %> ${this.props.<%= name.camelcase() %>.<%= titleField %>}`,
      }),
    };
  }

  props: any;
  state: any;

  handleClickDelete = () => {
    this.state.deleteActioner.do(`/<%= name.pluralize() %>/${this.props.<%= name.camelcase() %>.<%= apiField %>}.json`);
  }

  render() {
    const { <%= name.camelcase() %> } = this.props;
    const details = [{
      title: '<%= titleField.split().capitalize() %>',
      value: <%= name.camelcase() %>.<%= titleField %>,
    }];

    return (
      <div className={styles.Component}>
        <Edit<%= name.capitalize() %>Modal
          key={this.state.edit<%= name.capitalize() %>ModalParams.uuid}
          modalParams={this.state.edit<%= name.capitalize() %>ModalParams}
          <%= name.camelcase() %>={this.props.<%= name.camelcase() %>}
          onSuccess={this.props.loadItem}
        />
        <Row>
          <Col md={12} className="actions-listing">
            <Button shape="circle" icon="reload" onClick={this.props.loadItem} />
          </Col>
          <Col md={12} className="pull-right actions-listing">
            <Button shape="circle" onClick={this.state.edit<%= name.capitalize() %>ModalParams.show} icon="edit" type="primary" />
            <Popconfirm
              title="Are you sure？"
              okText="Yes"
              cancelText="Cancel"
              onConfirm={this.handleClickDelete}
            >
              <Button icon="close" shape="circle" type="danger" loading={this.state.deleteActioner.isLoading} />
            </Popconfirm>
          </Col>
        </Row>
        <Row className="ant-card-content">
          <DetailsContainer details={details} />
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

export default connector(<%= name.capitalize() %>Section);
