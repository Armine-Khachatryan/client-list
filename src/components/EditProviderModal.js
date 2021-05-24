import React, { Component } from 'react';
import { Button, Row, Col, Form, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';


class EditProviderModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props.info,
        };
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
        }
    };

    handleSubmit = () => {
        const { Providers } = this.state;
        if (!Providers) {
            return;
        }

        this.props.onSaveProvider({
            _id: this.state._id,
            Providers
        });
    };


    render() {
        const { onClose } = this.props;
        const { Providers } = this.state;


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
                        Edit Provider
            </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group as={Row} controlId="formHorizontalName" style={{ padding: "10px" }}>
                        <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                            Provider:
</Form.Label>
                        <Col sm={10}>
                            <Form.Control type="text"
                                onChange={this.handleChange}
                                name='Providers'
                                value={Providers}
                                onKeyPress={this.handleKeyDown} />
                        </Col>

                    </Form.Group>
                </Modal.Body>


                <Modal.Footer>

                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        onClick={this.handleSubmit}
                        variant='success'
                    >
                        Save Provider
            </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}



EditProviderModal.propTypes = {
    info: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSaveProvider: PropTypes.func.isRequired
};

export default EditProviderModal;

