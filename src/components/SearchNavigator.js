/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { AutoComplete, Input, Button, Icon } from 'antd';
import { push } from 'react-router-redux';
import { ItemLoader, getAxios } from 'awry-utilities';

import type { Reducer } from '../../types';
import styles from './SearchNavigator.scss';
import { debounce } from 'lodash';

class SearchNavigator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      term: '',
      groups: [],
      itemLoader: new ItemLoader({
        component: this,
        key: 'itemLoader',
        axiosGetter: () => getAxios('toro-client'),
        itemName: 'groups',
        ItemKlass: Object,
      }),
    };

    this.loadItem = debounce(this.loadItem, 300);
  }

  handleChangeTerm = (term) => {
    this.setState({
      term
    }, () => {
      if (this.state.term.length > 0) {
        this.state.itemLoader.url = `/search.json?term=${this.state.term}`;
        this.loadItem();
      }
    })
  }

  handleEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.handleSearch();
    }
  }

  handleSearch = () => {
    if (this.state.term.length > 0) {
      this.props.dispatch(push(`/search/${this.state.term}`));
    }
  }

  handleSelect = (value, option) => {
    this.props.dispatch(push(`/products/${value}`));
  }

  loadItem = () => {
    this.state.itemLoader.loadItem().then((groups) => {
      this.setState({
        groups,
      });
    });
  }

  renderGroups = () => {
    return this.state.groups.map((group) => {
      return (
        <AutoComplete.OptGroup key={group.title} label={group.title}>
          {
            group.products.map((item) => {
              return (
                <AutoComplete.Option key={item.slug} label={item.term} value={item.slug}>
                  {item.term}
                </AutoComplete.Option>
              )
            })
          }
        </AutoComplete.OptGroup>
      )
    })
  }

  render() {
    const { form } = this.props;
    // const searchButton = (
    //   <Button className={styles.Search} onClick={this.handleSearch}>
    //     <Icon type="search" />
    //   </Button>
    // );

    const placeholder = "Search...";
    const prefix = (
      <Icon type="search" />
    );

    return (
      <AutoComplete
        className={styles.Component}
        onSearch={this.handleChangeTerm}
        onSelect={this.handleSelect}
        dataSource={this.renderGroups()}
        dropdownAlign={
          {
            offset: [0, 0],
          }
        }
        defaultActiveFirstOption={false}
      >
        <Input className={styles.Input} onKeyPress={this.handleEnter} prefix={prefix} placeholder={placeholder} />
      </AutoComplete>
    );
  }
}

/* eslint-disable no-unused-vars */
const connector: Connector<{}, Props> = connect(
  (reducer: Reducer) => ({}),
);
/* eslint-enable no-unused-vars */

export default connector(SearchNavigator);
