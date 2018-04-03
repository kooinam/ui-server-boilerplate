/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form, Row, Col, Icon, Input, Upload, Checkbox } from 'antd';
import type { Connector } from 'react-redux';
import { getAxios, getFieldError, Actioner, getBaseUrl, getHeadersSetter } from 'awry-utilities';
import { push } from 'react-router-redux';

import type { Reducer } from '../../types';
import styles from './NewStashModal.scss';
import Stash from '../models/Stash';

class StashInputs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploading: [],
    };
  }

  render() {
    const { component, actioner, form, stash } = this.props;

    const uploadProps = {
      name: 'file',
      action: `${getBaseUrl('toro-client')}/attachments.json`,
      headers: getHeadersSetter('toro-client')(),
      data: {
        type: 'ImageAttachment',
      },
      accept: 'image/*',
      onChange: (info) => {
        const { uploading } = this.state;
        const file = info.file;

        if (file.status === 'uploading') {
          if (uploading.indexOf(file.uid) === -1) {
            uploading.push(file.uid);
          }
        } else if (file.status === 'done') {
          if (uploading.indexOf(file.uid) > -1) {
            uploading.splice(uploading.indexOf(file.uid), 1);
          }

          const attachmentId = file.response.attachment.id;
          component.setState({
            attachmentId,
          });
        } else if (file.status === 'error') {
          if (uploading.indexOf(file.uid) > -1) {
            uploading.splice(uploading.indexOf(file.uid), 1);
          }
        }

        this.setState({
          uploading,
        }, () => {
          if (this.state.uploading.length === 0) {
            component.setState({
              isUploading: false,
            });
          } else {
            component.setState({
              isUploading: true,
            });
          }
        });
      },
    };

    return (
      <div>
        <Row gutter={12}>
          <Col sm={24}>
            <Form.Item {...getFieldError(actioner.error, 'attachment_id')} label="Cover Photo" hasFeedback>
              <Upload.Dragger {...uploadProps}>
                <div>
                  Drag and drop or click to upload
                </div>
                <Icon type="upload" />
              </Upload.Dragger>
            </Form.Item>
          </Col>
          <Col sm={24}>
            <Form.Item {...getFieldError(actioner.error, 'name')} label="Name" hasFeedback>
              {form.getFieldDecorator('name', {
                initialValue: stash.name,
              })(
                <Input type="text" placeholder="Name" />,
              )}
            </Form.Item>
          </Col>
          <Col sm={24}>
            <Form.Item {...getFieldError(actioner.error, 'description')} label="Description" hasFeedback>
              {form.getFieldDecorator('description', {
                initialValue: stash.description,
              })(
                <Input type="textarea" placeholder="Description" rows={4} />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col sm={12}>
            <Form.Item { ...getFieldError(actioner.error, 'is_searchable') } label="Visible to public">
              {form.getFieldDecorator('is_searchable', {
              })(
                <Checkbox defaultChecked={stash.is_searchable} />
              )}
            </Form.Item>
          </Col>
          <Col sm={12}>
            <Form.Item { ...getFieldError(actioner.error, 'is_private') } label="Only member can view content">
              {form.getFieldDecorator('is_private', {
              })(
                <Checkbox defaultChecked={stash.is_private} />
              )}
            </Form.Item>
          </Col>
          <Col sm={12}>
            <Form.Item { ...getFieldError(actioner.error, 'need_approval') } label="Membership requires admin's approval">
              {form.getFieldDecorator('need_approval', {
              })(
                <Checkbox defaultChecked={stash.need_approval} />
              )}
            </Form.Item>
          </Col>
          <Col sm={12}>
            <Form.Item { ...getFieldError(actioner.error, 'only_admin_can_post') } label="Only admin can post">
              {form.getFieldDecorator('only_admin_can_post', {
              })(
                <Checkbox defaultChecked={stash.only_admin_can_post} />
              )}
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
  }
}

export {
  StashInputs,
};

class NewStashModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actioner: new Actioner({
        component: this,
        key: 'actioner',
        axiosGetter: () => getAxios('toro-client'),
        method: 'post',
        itemName: 'stash',
        ItemKlass: Stash,
        successMessageGetter: (stash) => {
          return `Stash ${stash.name} created successfully`;
        },
        successCallback: (stash) => {
          this.props.modalParams.dismiss();
          this.props.dispatch(push(`${this.props.urlPrefix || ''}/stashes/${stash.id}`));
        },
        errorMessageGetter: (error) => {
          return `Failed to create Stash`;
        },
      }),
      attachmentId: null,
      isUploading: false,
    };
  }

  handleSubmit = () => {
    const { form } = this.props;
    const { attachmentId } = this.state;

    form.validateFields((errors) => {
      if (errors) {
        return false;
      }

      const attributes = form.getFieldsValue();
      const params = {
        stash: attributes,
        attachment_id: attachmentId,
      };

      this.state.actioner.do('/stashes.json', params);

      return true;
    });
  }

  render() {
    const { modalParams, stash, form } = this.props;
    const { actioner, isUploading } = this.state;

    const footer = [(
      <Button
        key="cancel"
        className="btn-tertiary"
        onClick={modalParams.dismiss}
      >
        Cancel
      </Button>
    ), (
      <Button
        key="ok"
        className="btn-primary"
        onClick={this.handleSubmit}
        loading={actioner.isLoading}
        disabled={isUploading}
      >
        OK
      </Button>
    )];

    return (
      <Modal
        className={styles.Component}
        maskClosable={false}
        title="Create Stash"
        visible={modalParams.visible}
        footer={footer}
        onCancel={modalParams.dismiss}
      >
        <Form>
          <StashInputs {...{ component: this, actioner, stash, form }} />
        </Form>
      </Modal>
    );
  }
}

/* eslint-disable no-unused-vars */
const connector: Connector<{}, Props> = connect(
  (reducer: Reducer) => ({}),
);
/* eslint-enable no-unused-vars */

export default connector(Form.create()(NewStashModal));
