import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Row, Table, Pagination, PaginationItem, PaginationLink, } from 'reactstrap';

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

  render() {

    const userList = usersData.filter((user) => user.id < 10)

    return (
      <div className="animated fadeIn">
        
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Combined All Table
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
                    {userList.map((user, index) =>
                      <UserRow key={index} user={user}/>
                    )}
                  </tbody>
                </Table>
                <nav>
                  <Pagination>
                    <PaginationItem><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
                    <PaginationItem active>
                      <PaginationLink tag="button">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem><PaginationLink tag="button">2</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
                  </Pagination>
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
