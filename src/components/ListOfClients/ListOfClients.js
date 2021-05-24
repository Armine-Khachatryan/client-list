import React, { Component } from 'react';       
import {Table,  Button} from 'react-bootstrap';
import NewClient from '../NewClient/NewClient';
import EditClientModal from '../EditClientModal/EditClientModal';
import styles from './ListOfClientsStyle.module.css';



class ListOfClients extends Component{
    state = {
        clients:[],
        openNewClientModal: false,
        editClient: null,
        ppp:[]
    };


    componentDidMount() {
        fetch('http://localhost:3001/client', {
            method: 'GET',
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

                this.setState({
                    clients: res
                });
            })
            .catch((error) => {
                console.log('catch error', error);
            });
    }


    callbackFunction= (childData) => {
        this.setState({ppp: childData})
    };

    addClient = (newClient) => {
        fetch('http://localhost:3001/client', {
            method: 'POST',
            body: JSON.stringify(newClient),
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

                console.log("new client response", res);
                const clients = [...this.state.clients, res];

                this.setState({
                    clients,
                    openNewClientModal: false
                });
            })
            .catch((error) => {
                console.log('catch error', error);
            });
    };


    toggleNewClientModal = () => {
        this.setState({
            openNewClientModal: !this.state.openNewClientModal
        });
    };

    handleEdit = (editClient) => {
        this.setState({editClient })
        ;
    };

    handleSaveClient = (editedClient) => {
        fetch(`http://localhost:3001/client/${editedClient._id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(editedClient)
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
                const clients = [...this.state.clients];
                const foundIndex = clients.findIndex((client) => client._id === editedClient._id);
                clients[foundIndex] = editedClient;
                this.setState({
                    clients,
                    editClient: null    
                });
            })

            .catch((error) => {
                console.log('catch error', error);
            });
    };



    deleteClient = (clientId) => {
        fetch(`http://localhost:3001/client/${clientId}`, {
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
            const newClients = this.state.clients.filter((client) => clientId !== client._id);
            this.setState({
                clients: newClients,
                editClient: null
            });
        })

        .catch((error) => {
            console.log('catch error', error);
        });
};


    render (){
        const { clients, openNewClientModal, editClient, ppp}=this.state;
        const clientComponents=clients.map((client)=>{
            return <tr key={client._id}><td>{client.Name}</td><td> {client.Email}</td><td>{client.Phone}</td><td>{client.Providers}</td>
            <td> <button
            type="button"
            className="link-button"
            onClick={() => {this.handleEdit(client)}}
        >
        Edit
        </button></td>
            </tr>
        });

            return (
                <div style={{  width: "90%", margin: " 0 auto"}} >   
                    <h2 style={{ textAlign:"left"}}>List of Clients </h2>
                     
                        <Table  bordered  className={styles.table} >
                            <thead style={{ backgroundColor: "rgb(228, 237, 247)"}}>
                                <tr>
                                    
                                    <th  colSpan="4" className={styles.clients}> Clients </th>
                                    <th   className={styles.button}  colSpan="1">
                        <Button  
                                variant="primary"  style={{backgroundColor: "rgb(246, 246, 248)", color: "black", fontWeight: "bold"}}
                                onClick={this.toggleNewClientModal}>New Client 
                                </Button> </th> </tr> </thead>
                            <thead style={{ backgroundColor: "rgb(246, 246, 248)", textAlign: "left" }}>   
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Providers</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientComponents}
                            </tbody>
                        </Table>
                
            
                    {
                        openNewClientModal &&
                        <NewClient
                            onClose={this.toggleNewClientModal}
                            onAdd={this.addClient}
                            parentCallback={this.callbackFunction}
                        />
                    }
                    {
                        editClient &&
                        <EditClientModal
                            data={editClient}
                            onClose={() => this.handleEdit(null)}
                            onSave={this.handleSaveClient}
                            onDelete={this.deleteClient}   
                            ooo={ppp}
                        />
                    }
                </div>
            )
    }
}


export default ListOfClients;

