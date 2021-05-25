import React, { Component } from 'react';
import { Button, Col, Form, Row, Modal } from 'react-bootstrap';
import PropTypes from "prop-types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import styles from './NewClientStyle.module.css';
import EditProviderModal from '../EditProviderModal';

class NewClient extends Component {
    state = {
        Name: "",
        Email: "",
        Phone: "",
        Providers: "",
        providers: [],
        NameError: null,
        EmailError: null,
        PhoneError: null,
        editProvider: null,
        displayName: ""
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    handleKeyDown = (event) => {
        if (event.key === "Enter") {
            this.handleSubmit();
        };
    };

    handleSubmit = () => {
        const {Name, Email, Phone, providers} = this.state;
        let valid = true;
        let nameMessage = null;
        let emailMessage = null;
        let phoneMessage = null
        const emailReg = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!Email) {
            emailMessage = "Email is required";
            valid = false;
        }

        else if (Email && (!emailReg.test(Email))) {
            emailMessage = "Invalid email";
            valid = false;
        }

        if (!Name) {
            nameMessage = "Name is required";
            valid = false
        }

        if (!Phone) {
            phoneMessage = "Phone is required";
            valid = false
        }
        if (typeof Phone !== "undefined") {
            let pattern = new RegExp(/^[0-9\b]+$/);
            if (!pattern.test(Phone)) {
                phoneMessage = "Please enter only number"
                valid = false;

            }
            else if (Phone.length !== 10) {
                phoneMessage = "Please enter valid phone number";
                valid = false
            }

        }
        this.setState({
            NameError: Name ? null : nameMessage,
            EmailError: emailMessage,
            PhoneError: phoneMessage
        });
        const newClient = {
            Name,
            Email,
            Phone,
            Providers: providers.filter(provider => provider.isChecked).map(elem => elem._id),
            displayName
        };
        if (valid) {
            this.props.onAdd(newClient);
        }
        const ProvidersComponent = providers.map((provider) => {
            return <div key={provider._id}> {provider.Providers}
                <input
                    type="checkbox"
                    checked={provider.isChecked}
                    value={provider.Providers}
                    onClick={() => this.toggleProvider(provider._id)} />
                    <label> {provider.Providers}</label>

                <Button
                    className='m-1'
                    variant="warning"
                    onClick={() => this.handleEdit(provider)}
                ><FontAwesomeIcon icon={faEdit} /></Button>
                <Button
                    className='m-1'
                    variant="danger"
                    onClick={() => this.deleteProvider(provider._id)}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </Button>

            </div>
            
        })
        this.props.parentCallback(ProvidersComponent);
    }


    toggleProvider = (providerId) => {
        let toggledProvider = this.state.providers.find(provider => provider._id === providerId);
        toggledProvider.isChecked = !toggledProvider.isChecked;
        this.setState({
            providers: [...this.state.providers]
        });
    };


    handleEdit = (editProvider) => {
        this.setState({ editProvider });
    };


    handleSaveProvider = (editedProvider) => {
        fetch(`http://localhost:3001/client/${editedProvider._id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(editedProvider)
        })
        .then(async (response) => {
            const res = await response.json();

            if (response.status >= 400 && response.status < 600) {
                if (res.error) {
                    throw res.error;
                }
                else {
                    throw new Error('Something went wrong!');
                }
            }
        const providers = [...this.state.providers];
        const foundIndex = providers.findIndex((provider) => provider._id === editedProvider._id);
        providers[foundIndex] = editedProvider;
        this.setState({
            providers,
            editProvider: null,
            Providers:" "
        });
    })
            .catch((error) => {
                console.log('catch error', error);
            });
    };


    addProviders = () => {
        const { Providers } = this.state;
     const newProvider = { Providers: Providers, isChecked: false };
        fetch('http://localhost:3001/provider', {
            method: 'POST',
            body: JSON.stringify(newProvider),
            headers: {
                "Content-Type": 'application/json'
            }
        })
            .then(async (response) => {
                const res = await response.json();
                if (response.status >= 400 && response.status < 600) {
                    if (res.error) {
                        throw res.error;
                    }
                    else {
                        throw new Error('Something went wrong!');
                    }
                }

                const providers = [...this.state.providers, res];
                this.setState({
                    providers,
                    Providers: ""
                });
            })
            .catch((error) => {
                console.log('catch error', error);
            });
    };



    deleteProvider = (providerId) => {
        fetch(`http://localhost:3001/provider/${providerId}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": 'application/json'
            }
        })
        .then(async (response) => {
            const res = await response.json();

            if (response.status >= 400 && response.status < 600) {
                if (res.error) {
                    throw res.error;
                }
                else {
                    throw new Error('Something went wrong!');
                }
            }


        const newProviders = this.state.providers.filter((provider) => providerId !== provider._id);
        this.setState({
            providers: newProviders,
        });
    })
    .catch((error) => {
        console.log('catch error', error);
    });
};
    


    render() {
        const { onClose } = this.props;
        const { providers, Email, Phone, Providers, Name, NameError, EmailError, PhoneError, editProvider } = this.state;


        const ProvidersComponent = providers.map((provider) => {
            return <div key={provider._id}> 
                <input
                    type="checkbox"
                    checked={provider.isChecked}
                    value={provider.Providers}
                    onClick={() => this.toggleProvider(provider._id)} />
                    <label> {provider.Providers}</label>

                <Button
                    className='m-1'
                    variant="warning"
                    onClick={() => this.handleEdit(provider)}
                ><FontAwesomeIcon icon={faEdit} /></Button>
                <Button
                    className='m-1'
                    variant="danger"
                    onClick={() => this.deleteProvider(provider._id)}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </Button>

            </div>
            
        })
        
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
                        New Client
</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
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
                                    type="email"
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
                                <Form.Control className={PhoneError ? styles.invalid : ""}
                                    type="tel" placeholder=""
                                    name='Phone'
                                    value={Phone}
                                    onChange={this.handleChange}
                                    onKeyPress={this.handleKeyDown} />
                                {
                                    <Form.Text className="text-danger" >
                                        {PhoneError}
                                    </Form.Text>
                                }
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formHorizontalProviders" style={{ padding: "10px" }}>
                            <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                                Providers:
    </Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="text" placeholder=""
                                    name='Providers'
                                    onChange={this.handleChange}
                                    value={Providers}
                                />
                            </Col>
                            <Col sm={4}>
                                <Button className="mb-2"
                                    onClick={this.addProviders}>
                                    Add provider
  </Button>
                            </Col>
                            <Col>
                                {ProvidersComponent}
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        onClick={this.handleSubmit}
                        variant='success'
                    >
                        Add Client
        </Button>

                </Modal.Footer>
                {
                    editProvider &&
                    <EditProviderModal
                        info={editProvider}
                        onClose={() => this.handleEdit(null)}
                        onSaveProvider={this.handleSaveProvider}
                        onaddProv={this.addProviders}
                        /*checkedOnes={checkedProviders}*/
                    />
                }
            </Modal>
        )
    }
}

NewClient.propTypes = {
    onAdd: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSaveProvider: PropTypes.func.isRequired,
    onaddProv: PropTypes.func.isRequired,
}


export default NewClient;




