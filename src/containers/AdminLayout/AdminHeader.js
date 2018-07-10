import React, { Component } from 'react';
import { Button, Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/img_logo.png'


const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class AdminHeader extends Component {

  state = {
    redirectToLogin: false
  }

  handleLogout(event){

    localStorage.setItem('token', 'none');
    this.setState({redirectToLogin : true});

  }

  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    const { redirectToLogin } = this.state;

    if (redirectToLogin) {
      return <Redirect to="/login" />;
    }

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 40, height: 40, alt: 'DraftMatch' }}
          minimized={{ src: logo, width: 40, height: 40, alt: 'DraftMatch' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        
        <Nav className="ml-auto" navbar>
          <NavItem className="d-md-down-none" style={{marginRight: 2+'em'}}>
            <Button block color="light" onClick={this.handleLogout.bind(this)}><i className="icon-logout"></i><span> Logout </span></Button>
          </NavItem>
          
        </Nav>

      </React.Fragment>
    );
  }
}

AdminHeader.propTypes = propTypes;
AdminHeader.defaultProps = defaultProps;

export default AdminHeader;
