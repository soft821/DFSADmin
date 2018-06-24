import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Row, Table, Pagination, PaginationItem, PaginationLink, } from 'reactstrap';
import  FunctionablePaginator  from '../mine/FunctionablePaginator';
import usersData from './UsersData'

function UserRow(props) {
  const user = props.user
  const userLink = `#/users/${user.id}`

  const getBadge = (status) => {
    return status === 'Active' ? 'success' :
      status === 'Inactive' ? 'secondary' :
        status === 'Pending' ? 'warning' :
          status === 'Banned' ? 'danger' :
            'primary'
  }

  return (
    <tr key={user.id.toString()}>
        <th scope="row"><a href={userLink}>{user.id}</a></th>
        <td><a href={userLink}>{user.name}</a></td>
        <td>{user.registered}</td>
        <td>{user.role}</td>
        <td><Badge href={userLink} color={getBadge(user.status)}>{user.status}</Badge></td>
    </tr>
  )
}

class Users extends Component {
  
 
  constructor(props){
    super(props);
    this.state = {
      userList: []
    }
    
    this.currentPage = 1
    this.defaultCountPerPage = 10;
    this.totalDisplayed = 5;
    
    
    this.totalPages  = Math.ceil(usersData.length / this.defaultCountPerPage);    
    

  }

  componentDidMount() {
    this.setState({userList : this.countUserList()})
  }


  handlePagerClick(e){
    this.currentPage = e;

    console.log(this.currentPage);
    this.setState({userList : this.countUserList()})
  }

  countUserList()
  {

    if (this.currentPage * this.defaultCountPerPage > usersData.length) {
      return usersData.slice((this.currentPage - 1)*this.defaultCountPerPage,  usersData.length)
    } else {
      return usersData.slice((this.currentPage - 1)*this.defaultCountPerPage,  this.currentPage * this.defaultCountPerPage)
    }
  }

  render() {

    return (
      <div className="animated fadeIn">
        
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Registered Users
              </CardHeader>
              <CardBody>
                <Table hover bordered responsive>
                  <thead>
                  <tr>
                    <th scope="col">id</th>
                    <th scope="col">Username</th>
                    <th scope="col">Date registered</th>
                    <th scope="col">Role</th>
                    <th scope="col">Status</th>
                  </tr>
                  </thead>
                  <tbody>
                    {this.state.userList.map((user, index) =>
                      <UserRow key={index} user={user}/>
                    )}
                  </tbody>
                </Table>
                <nav>
                  <FunctionablePaginator pageChanged={this.handlePagerClick.bind(this)} totalPages={this.totalPages} totalDisplayed={this.totalDisplayed}>                 
                  </FunctionablePaginator>
                </nav>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Users;
