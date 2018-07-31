import React, { Component } from 'react';
// import { Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { toast } from 'react-toastify';
import { API_ROOT } from '../../../api-config';
import axios, { post } from 'axios';
import {
  Badge,
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
} from 'reactstrap';

function SectionRow(props) {
  const section = props.section
  const sequence = props.sequence

  function addSection(e)
  {
    props.addSection(e);
  }

  function changeSectionTitle(e)
  {
    props.changeSectionTitle(section.id, e);
  }

  function changeSectionSubTitle(e)
  {
    props.changeSectionSubTitle(section.id, e);
  }

  function changeSectionDescription(e)
  {
    props.changeSectionDescription(section.id, e);
  }
  
  function changeSectionImage(e)
  {
    props.changeSectionImage(section.id, e);
  }
    return (
            <div key={section.id.toString()}>
              <FormGroup row>
                <Col md="1">
                  <Label></Label>
                </Col>
                <Col xs="12" md="11">
                  <h4><p className="form-control-static">Section{section.id.toString()}</p></h4>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="1">
                  <Label></Label>
                </Col>
                <Col md="2">
                  <Label htmlFor="text-input">Title of the section</Label>
                </Col>
                <Col xs="12" md="8">
                  <Input type="text" id="text-input" onChange={changeSectionTitle}  value={section.title} name="text-input" placeholder="Title of the section" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="1">
                  <Label></Label>
                </Col>
                <Col md="2">
                  <Label htmlFor="text-input">Subtitle of the section</Label>
                </Col>
                <Col xs="12" md="8">
                  <Input type="text" onChange={changeSectionSubTitle} value={section.subtitle} id="text-input" name="text-input" placeholder="Subtitle of the section" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="1">
                  <Label></Label>
                </Col>
                <Col md="2">
                  <Label htmlFor="textarea-input">Description</Label>
                </Col>
                <Col xs="12" md="8">
                  <Input type="textarea" onChange={changeSectionDescription} value={section.description} name="textarea-input" id="textarea-input" rows="9"
                         placeholder="Description of the section..." />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="1">
                  <Label></Label>
                </Col>
                <Col md="2">
                  <Label htmlFor="file-input">Select section photo</Label>
                </Col>
                <Col xs="12" md="8">
                  <Input type="file" onChange={changeSectionImage} id="file-input" name="file-input" />
                </Col>
              </FormGroup>
            </div>
  
      )
}

function CategoryRow(props) {
  const category = props.category
  const sequence = props.sequence


  function addSection(e){
    props.addSection(e);
  }
    return (
               <option key={category.id.toString()} value={category.id}>{category.name}</option>
  
      )
}


class EditBlog extends Component {
    
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.handleContent = this.handleContent.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddSection = this.handleAddSection.bind(this);
    this.handleDeleteLastSection = this.handleDeleteLastSection.bind(this);
    this.sections = [];
    this.sectionImages = [];
    this.sectionLastId = 0;
    this.state = {
      sectionList:[],
      categoriesList:[],
      category: 0,
      blogTitle: "",
      blogDescription: "",
      coverImage:[],
      sectionImages: [],
      sectionTitle: "",
      sectionSubTitle: "",
      color: 0,
      collapse: true,
      fadeIn: true,
      timeout: 300
    };
  }

  componentDidMount() {
    this.loadCategory()
    this.loadBlogData()
    
  }
  loadCategory()
  {
      let authToken = localStorage.getItem('token');

      fetch(API_ROOT + "/api/v1/posts/create", {
        method: 'get',
        headers: {
            'Authorization' : 'Baerer ' + authToken,
            'Content-Type': 'application/json',
        }, 
       
      }).then(function(response){
       
          return response.json();
    
      }).then((data) => { 
        if (data['status'] == 0) {
          this.categoriesData = data['response'];
          this.categoriesRecoveryData = data['response'];
          this.setState({categoriesList : this.categoriesData})
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

  loadBlogData()
  {
    let authToken = localStorage.getItem('token');

    fetch(API_ROOT + "/api/v1/admin/posts/edit/" + this.props.match.params.id.toString(), {
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
        this.setState({blogList : this.blogData});
        {this.blogData.map((blog, index) =>
          this.setState({category : blog.category, color : blog.color,blogTitle : blog.title, blogDescription : blog.description, sectionList: blog.sections})
        )}
        this.sections = this.state.sectionList;
        console.log(this.sections)

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

  toggle() {
  this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
  this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  handleContent(event){
    this.setState({content : event.target.value});
  }

  getId(event){
    switch(event.target.value){
        case "Terms of Use": return 1; 
                break;
        case "Privacy Policy": return 2; 
                break;
        case "Responsible Play": return 3; 
                break;
        case "Trust and Safety": return 4; 
                break;
         
    }
  }

  handleDeleteLastSection(event){
    this.sections.splice(-1, 1);
    this.sectionLastId = this.sectionLastId - 1;
    this.setState({sectionList: this.sections});
  }
  handleAddSection(event)
  {
    this.sectionLastId = this.sectionLastId + 1;
    this.sections.push({id: this.sectionLastId, title: 'title of the section', subtitle: 'subtitle of the section', description: 'description of the section'});
    this.setState({sectionList: this.sections});
    console.log(this.state.sectionList);
  }

  handleCategory(event){
    this.setState({category : event.target.value});
  }
  handleColor(event){
    this.setState({color : event.target.value});
  }
  handleBlogTitle(event){
    this.setState({blogTitle: event.target.value});
  }
  handleBlogDescription(event){
    this.setState({blogDescription: event.target.value});
  }
  handleSectionTitle(section_id, event){
    this.sections[section_id - 1].title = event.target.value;
    this.setState({sectionList: this.sections});
  }
  handleSectionSubTitle(section_id, event){
    this.sections[section_id - 1].subtitle = event.target.value;
    this.setState({sectionList: this.sections});
  }
  handleSectionDescription(section_id, event){
    this.sections[section_id - 1].description = event.target.value;
    this.setState({sectionList: this.sections});
  }
  handleSectionImage(section_id, event)
  {
    if (this.sectionImages[section_id - 1] != null){
      this.sectionImages[section_id - 1].sectionImage = event.target.files[0];
    }
    else{
      this.sectionImages.push({id: section_id, sectionImage:event.target.files[0]})
    }
    
    this.setState({sectionImages: this.sectionImages});
    console.log(this.state.sectionImages)
  }
  handleCoverImage(event){
    this.setState({coverImage: event.target.files[0]});
    console.log(this.state.coverImage);
  }
  handleSubmit(event){
    let content;
    let formData = new FormData();
    formData.append('coverImage', this.state.coverImage);
    formData.append('title', this.state.blogTitle);
    formData.append('description', this.state.blogDescription);
    formData.append('category', this.state.category);
    formData.append('color', this.state.color);
    formData.append('sections', JSON.stringify(this.state.sectionList));
    let images = this.state.sectionImages;   
    if(images) {

      for(let i = 0; i < images.length; i++){
        formData.append('images[]', images[i]['sectionImage'], images[i]['id']);
      }
       
    }
    console.log(this.state.sectionList)
    let authToken = localStorage.getItem('token');
    fetch( API_ROOT + "/api/v1/admin/posts/update/" + this.props.match.params.id.toString(), {
      "body": formData,
      "headers":{
          'Authorization' : 'Baerer ' + authToken,
      },
      "method": "POST"
    })
    .then(function(response){
        
        return response.json();
    
      }).then((data) => { 
      

        if (data['status'] == 0) {
          toast.success(data['message'], {
            position: toast.POSITION.TOP_RIGHT
          });
          
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
    event.preventDefault();
  }

    render() {

        return (
            <div className="app align-items-top">
               <Row>
                  <Col xs="12" md="12">
                    <Card>
                      <CardHeader>
                        <strong>Blog</strong> Edit
                      </CardHeader>
                      <CardBody>
                        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                          <FormGroup row>
                            <Col md="3">
                              <Label htmlFor="select">Choose category</Label>
                            </Col>
                            <Col xs="12" md="9">
                              <Input type="select" onChange={this.handleCategory.bind(this)} value={this.state.category} name="select" id="select">
                               
                                {this.state.categoriesList.map((category, index) =>
                                  <CategoryRow key={index} sequence={index} category={category}/>
                                )}
                              </Input>
                            </Col>
                          </FormGroup>
                          <FormGroup row>
                            <Col md="3">
                              <Label htmlFor="select">Choose category color</Label>
                            </Col>
                            <Col xs="12" md="9">
                              <Input type="select" onChange={this.handleColor.bind(this)} value={this.state.color} name="select" id="select">
                                <option value="0">Please select category color</option>
                                <option value="#000000">Black</option>
                                <option value="#808080">Gray</option>
                                <option value="#ff0000">Red</option> 
                                <option value="#ff0000">Light red</option>
                                <option value="#8b0000">Dark red</option> 
                                <option value="#ffa500">Orange</option>
                              </Input>
                            </Col>
                          </FormGroup>
                          
                          <FormGroup row>
                            <Col md="3">
                              <Label htmlFor="file-input">Select cover photo</Label>
                            </Col>
                            <Col xs="12" md="9">
                              <Input type="file" onChange={this.handleCoverImage.bind(this)} id="file-input" name="file-input" />
                            </Col>
                          </FormGroup>
                          <FormGroup row>
                            <Col md="3">
                              <Label htmlFor="text-input">Title</Label>
                            </Col>
                            <Col xs="12" md="9">
                              <Input type="text" onChange={this.handleBlogTitle.bind(this)} value={this.state.blogTitle} id="text-input" name="text-input" placeholder="Blog title" />
                            </Col>
                          </FormGroup>
                          <FormGroup row>
                            <Col md="3">
                              <Label htmlFor="textarea-input">Description</Label>
                            </Col>
                            <Col xs="12" md="9">
                              <Input type="textarea" onChange={this.handleBlogDescription.bind(this)} value={this.state.blogDescription} name="textarea-input" id="textarea-input" rows="9"
                                     placeholder="Blog description..." />
                            </Col>
                          </FormGroup>
                          <FormGroup row>
                            <Col md="12">
                              <Label>Blog Sections</Label>
                            </Col>
                          </FormGroup>
                          
                              {this.state.sectionList.map((section, index) =>
                                <SectionRow key={index} sequence={index} section={section} changeSectionTitle={this.handleSectionTitle.bind(this)}  changeSectionSubTitle={this.handleSectionSubTitle.bind(this)}  changeSectionDescription={this.handleSectionDescription.bind(this)} changeSectionImage={this.handleSectionImage.bind(this)} addSection={this.handleAddSection.bind(this)}/>
                              )}
                        
                        </Form>
                      </CardBody>
                      <CardFooter>
                        <Button type="submit" onClick={this.handleSubmit.bind(this)} size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Update</Button>
                        <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Cancel</Button>
                      </CardFooter>
                    </Card>
                  </Col>
               </Row>
            </div>
        )
      }


}

export default EditBlog;