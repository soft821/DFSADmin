import React from 'react';
import AdminLayout from '../containers/AdminLayout';
import { Redirect, Route, Switch } from 'react-router-dom';


const adminAuth = {
    
  authenticate(){

    if (!localStorage.getItem('token') || localStorage.getItem('token') == 'none') {
      return false;
    } else {
      return true;
    }
  }
};


const GuardRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>

      adminAuth.authenticate() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);


export default GuardRoute;

