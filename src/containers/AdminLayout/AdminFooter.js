import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class AdminFooter extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <span><a href="https://draftmatch.com">DraftMatch Admin Panel</a> &copy; 2018 All right reserved.</span>
        <span className="ml-auto">Powered by <a href="https://draftmatch.com">Jing Zhang</a></span>
      </React.Fragment>
    );
  }
}

AdminFooter.propTypes = propTypes;
AdminFooter.defaultProps = defaultProps;

export default AdminFooter;
