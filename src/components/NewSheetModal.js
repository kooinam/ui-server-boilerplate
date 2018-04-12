/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form, Row, Col, Upload, Icon, Input, Radio, Spin } from 'antd';
import type { Connector } from 'react-redux';
import { ItemLoader, getAxios, getBaseUrl, getHeadersSetter, getFieldError, Actioner, FilterSelect, TableParams } from 'awry-utilities';
import { push } from 'react-router-redux';
import { debounce } from 'lodash';

import type { Reducer } from '../../types';
import styles from './NewSheetModal.scss';
import Sheet from '../models/Sheet';
import Stash from '../models/Stash';
import { createSheet } from '../actions/sheet';
import LinkPreviewSection from './LinkPreviewSection';
import EditorSection from './EditorSection';

class SheetInputs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stashesTableParams: new TableParams({
        component: this,
        key: 'stashesTableParams',
        axiosGetter: () => getAxios('toro-client'),
        itemsName: 'stashes',
        ItemKlass: Stash,
        url: '/stashes.json',
        pagination: {
          per_page: 10,
        },
        filter: {
          s: ['name ASC'],
        },
        scope: 'mine',
      }),
      uploading: [],
    };

    this.loadLinkPreview = debounce(this.loadLinkPreview, 500);
  }

  handleChangeRadio = (e) => {
    const { component } = this.props;

    if (component.state.attachmentType !== e.target.value) {
      component.setState({
        attachmentType: e.target.value,
        link: '',
      });
    }
  }

  loadLinkPreview = (link) => {
    this.props.component.setState({
      link,
    });
  }

  renderAttachment = () => {
    const { component, actioner, form, sheet, attachmentType, link } = this.props;

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

          const { attachmentIds } = component.state;
          attachmentIds.push(file.response.attachment.id);

          component.setState({
            attachmentIds,
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

    if (attachmentType === 'image') {
      return (
        <Form.Item {...getFieldError(actioner.error, 'attachments')} hasFeedback>
          <Upload.Dragger {...uploadProps} className={styles.Uploader}>
            <div className={styles.UploaderText}>
              Drag and drop or click to upload
            </div>
            <Icon type="upload" />
          </Upload.Dragger>
        </Form.Item>
      );
    } else if (attachmentType === 'link') {
      const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;

      return (
        <div>
          <Form.Item {...getFieldError(actioner.error, 'link_attachment')} label="Link" hasFeedback>
            {form.getFieldDecorator('link', {
              rules: [
                { required: true, message: 'Link is required' },
                {
                  pattern: regex, message: 'Link is not valid',
                },
              ],
            })(
              <Input
                type="text"
                placeholder="http://..."
                onChange={
                  (e) => {
                    this.loadLinkPreview(e.target.value);
                  }
                }
              />
            )}
          </Form.Item>
          <LinkPreviewSection link={link} key={link} />
        </div>
      );
    } else if (attachmentType === 'text') {
      return (
        <Form.Item {...getFieldError(actioner.error, 'attachments')} hasFeedback>
          <EditorSection
            onChange={
              (value) => {
                console.log(value);
              }
            }
          />
        </Form.Item>
      );
    }
  }

  render() {
    const { actioner, form, sheet, edit, attachmentType, link } = this.props;
    const { stashesTableParams } = this.state;

    return (
      <Row className={styles.InputWrapper} gutter={16}>
        {
          !edit && (
            <Col sm={24} className={styles.Radio}>
              <Radio.Group onChange={this.handleChangeRadio} defaultValue={attachmentType}>
                <Radio.Button value="image">
                  <Icon type="picture" />
                </Radio.Button>
                <Radio.Button value="link">
                  <Icon type="link" />
                </Radio.Button>
                <Radio.Button value="text">
                  <Icon type="file-word" />
                </Radio.Button>
              </Radio.Group>
            </Col>
          )
        }
        {
          !edit && (
            <Col sm={(attachmentType === 'text') ? 24 : 12}>
              {this.renderAttachment()}
            </Col>
          )
        }
        <Col sm={(edit || attachmentType === 'text') ? 24 : 12}>
          <Row>
            {
              !edit && (
                <Col sm={24}>
                  <FilterSelect
                    tableParams={stashesTableParams}
                    filterFields={['name_cont']}
                    initialValue={this.props.stash}
                    keyField='id'
                    labelField='name'
                    name={'Stash'}
                    form={form}
                    formKey="stash_id"
                    error={actioner.error}
                    errorKeys={['stash_id']}
                    disabled={(this.props.stash) ? true : false}
                  />
                </Col>
              )
            }
            <Col sm={24}>
              <Form.Item {...getFieldError(actioner.error, 'title')} label="Title" hasFeedback>
                {form.getFieldDecorator('title', {
                  initialValue: sheet.title,
                })(
                  <Input type="textarea" placeholder="Title" autosize />,
                )}
              </Form.Item>
            </Col>
            <Col sm={24}>
              <Form.Item {...getFieldError(actioner.error, 'description')} label="Description" hasFeedback>
                {form.getFieldDecorator('description', {
                  initialValue: sheet.description,
                })(
                  <Input type="textarea" placeholder="Description" autosize />,
                )}
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export {
  SheetInputs,
};

class NewSheetModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actioner: new Actioner({
        component: this,
        key: 'actioner',
        axiosGetter: () => getAxios('toro-client'),
        method: 'post',
        itemName: 'sheet',
        ItemKlass: Sheet,
        successMessageGetter: (sheet) => {
          return 'Sheet created successfully';
        },
        successCallback: (sheet) => {
          this.props.modalParams.dismiss();
          this.props.dispatch(push(`/stashes/${sheet.stash_id}/sheets`));
          this.props.dispatch(createSheet(sheet));
        },
        errorMessageGetter: (error) => {
          return `Failed to create Sheet`;
        },
      }),
      attachmentIds: [],
      isUploading: false,
      uploading: [],
      attachmentType: 'image',
    };
  }

  handleSubmit = () => {
    const { form } = this.props;
    const { attachmentIds, attachmentType } = this.state;

    form.validateFields((errors) => {
      if (errors) {
        return false;
      }

      const attributes = form.getFieldsValue();
      const params = {
        sheet: attributes,
        attachment_ids: attachmentIds,
      };
      if (params.sheet.stash_id) {
        params.sheet.stash_id = params.sheet.stash_id.key;
      }
      params.sheet.attachment_type = attachmentType;

      this.state.actioner.do('/sheets.json', params);

      return true;
    });
  }

  render() {
    const { modalParams, stash, sheet, form } = this.props;
    const { actioner, isUploading, attachmentType, link } = this.state;

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
        width={800}
        maskClosable={false}
        title="Create Sheet"
        visible={modalParams.visible}
        footer={footer}
        onCancel={modalParams.dismiss}
      >
        <Form>
          <SheetInputs {...{ stash, sheet, form, actioner, attachmentType, link, component: this, }} />;
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

export default connector(Form.create()(NewSheetModal));
