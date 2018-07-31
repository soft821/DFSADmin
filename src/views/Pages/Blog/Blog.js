import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import { API_ROOT } from '../../../api-config';
import { toast } from 'react-toastify';
import axios, { post } from 'axios';

function SectionRow(props) {
  const section = props.section
  const sequence = props.sequence
  if (!section.image){
      return (
          <div key={section.id.toString()}>
            <h2>{section.title}</h2><br></br>
            <h3>{section.subtitle}</h3><br></br>
            <br></br><br></br>
            <p>{section.description}</p>
            <br></br><br></br>
          </div>
      )
  }
  else{

      return (
              <div key={section.id.toString()}>
                <h2>{section.title}</h2><br></br>
                <h3>{section.subtitle}</h3><br></br>
                <img src={section.image} width='400' height='300' class="img-responsive"/>
                <br></br><br></br>
                <p>{section.description}</p>
                <br></br><br></br>
              </div>
        )
  }
}

function BlogRow(props) {
  const blog = props.blog
  const editLink = `/blogs/edit/${blog.id}`
  const sequence = props.sequence
  return (
          <div key={blog.id.toString()}>
            <h1>{blog.title}<span>({blog.categoryName})</span></h1><br></br>
            <img src={blog.image} width='400' height='300' class="img-responsive"/>
            <br></br><br></br>
            <p>{blog.description}</p>
            {blog.sections.map((section, index) =>
                <SectionRow key={index} sequence={index} section={section}/>
            )}  
            <h4>By {blog.name}</h4><a href={editLink}>Edit</a>
          </div>
    )
}
class Blog extends Component {

    constructor(props){
    super(props);
    this.state = {
      primary: false,
      rate: 0,
      username: '',
      blogList: [],
      blogTitle: '',
    }
    // this.togglePrimary = this.togglePrimary.bind(this);
    // this.confirmDelete = this.confirmDelete.bind(this);
  }

  componentDidMount() {
    this.loadBlogData()
    
  }

  loadBlogData()
  {
    let authToken = localStorage.getItem('token');

    fetch(API_ROOT + "/api/v1/posts/details/" + this.props.match.params.id.toString(), {
      method: 'get',
      headers: {
          'Authorization' : 'Baerer ' + authToken,
          'Content-Type': 'application/json',
      }, 
     
    }).then(function(response){
     
        return response.json();
  
    }).then((data) => { 
      if (data['status'] == 0) {
        this.blogData = data['response'];
        this.blogRecoveryData = data['response'];
        this.setState({blogList : this.blogData})
        return;
      } else {
        toast.error(data['message'], {
            position: toast.POSITION.TOP_RIGHT
          });
      }


    }).catch(function(error) {
      toast.error(error, {
          position: toast.POSITION.TOP_RIGHT
        });
    });
    
  }

  render() {
    return (
       <div className="app align-items-top">
        <Row>
          <Col xs="12" md="12">
            <Card>
              <CardHeader>
                <strong>Blog details</strong>
              </CardHeader>
              <CardBody>
                   {this.state.blogList.map((blog, index) =>
                      <BlogRow key={index} sequence={index} blog={blog}/>
                    )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        
      </div>
    )
  }
}

export default Blog;
