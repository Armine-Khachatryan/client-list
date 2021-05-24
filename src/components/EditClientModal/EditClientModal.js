import React, { Component } from 'react';
import { Button, Row, Col, Form, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import styles from './EditClientModalStyle.module.css';


class EditClientModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props.data,
            ...props.ooo
        };
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        const { Name, Email, Phone} = this.state;
        let valid = true;
        let nameMessage=null;
        let emailMessage = null;
        let phoneMessage=null;
        const emailReg = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        
        if (!Email) {
            emailMessage = "Email is required";
            valid = false;
        }

        else if (Email && (!emailReg.test(Email))) {
            emailMessage = "Invalid email";
            valid = false;
        }

        if (!Name){
            nameMessage = "Name is required";
            valid=false
        }

        if (!Phone){
            phoneMessage = "Phone is required";
            valid=false
        }
        if(typeof Phone!=="undefined"){
            let pattern=new RegExp(/^[0-9\b]+$/);
            if (!pattern.test(Phone)) {
                phoneMessage = "Please enter only number"
                valid = false;
            }

            else if(Phone.length !== 10){
                phoneMessage = "Please enter valid phone number";
                valid = false
              }
            }
         this.setState({
            NameError: Name ? null : nameMessage,
            EmailError: emailMessage,
            PhoneError: phoneMessage
        });

        this.setState({
            [name]: value
        });
    };

    handleKeyDown = (event) => {
        if (event.key === "Enter") {
            this.handleSubmit();
        }
    };

    handleSubmit = () => {
        const { Name, Email, Phone, Providers } = this.state;
        
       
        this.props.onSave({
            _id: this.state._id,
            Name,
            Email,
            Phone,
            Providers   
        });
    };

    addProviderNewOne=()=>{
        const {Providers} =this.state;
        this.props.onAddProv({
            _id: this.state._id,
            Providers
        })
    }

    render() {
        const { onClose, onDelete, data, ooo } = this.props;
        const { Name, Email, Phone, Providers, NameError, EmailError, PhoneError} = this.state;
        
        return (
            <Modal
                show={true}
                onHide={onClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" style={{ color: "blue", fontWeight: "bold" }}>
                        Edit Client
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group as={Row} controlId="formHorizontalName" style={{ padding: "10px" }}>
                        <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                            Name:
                        </Form.Label>   
                        <Col sm={10}>
                            <Form.Control className={NameError ? styles.invalid : ""}
                            type="text" 
                                onChange={this.handleChange}
                                name='Name'
                                value={Name}
                                onKeyPress={this.handleKeyDown} />
                                 {
                                    <Form.Text className="text-danger" >
                                        {NameError}
                                    </Form.Text>
                                }
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalEmail" style={{ padding: "10px" }}>
                        <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                            Email:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control className={EmailError ? styles.invalid : ""}
                                name='Email'
                                value={Email}
                                onChange={this.handleChange} 
                                onKeyPress={this.handleKeyDown} />
                                   {
                                    <Form.Text className="text-danger" >
                                        {EmailError}
                                    </Form.Text>
                                }
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalPhone" style={{ padding: "10px" }}>
                        <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                            Phone:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control type="tel" placeholder=""
                                name='Phone'
                                value={Phone}
                                onChange={this.handleChange} />
                                <Form.Text className="text-danger" >
                                        {PhoneError}
                                    </Form.Text>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalProviders" style={{ padding: "10px" }}>
                        <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                            Providers:
                        </Form.Label>
                        <Col sm={6}>
                            <Form.Control className={PhoneError ? styles.invalid : ""}
                                name='Providers'
                                value={Providers}
                                onChange={this.handleChange}
                                onKeyPress={this.handleKeyDown} 
                            />
                        </Col>
                        <Col sm={4}>
                            <Button className="mb-2"
                             onClick={this.addProviderNewOne}
                            >
                                Add provider       
                            </Button>
                        </Col>
                        <Col>{ooo}</Col>
                    </Form.Group>
                </Modal.Body> 
                <Modal.Footer>
                    <Button
                    onClick={() => onDelete(data._id)}
                    variant='danger'
                    >
                        Delete Client
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                     <Button
                        onClick={this.handleSubmit}
                        variant='success'
                    >
                        Save Client
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}


EditClientModal.propTypes = {
    data: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default EditClientModal;

