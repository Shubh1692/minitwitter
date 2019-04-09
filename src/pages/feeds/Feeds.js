import React, { Component } from 'react';
import { Card, Button, ListGroup, Navbar, Nav, Form } from 'react-bootstrap';
import { API_DOMAIN, socket } from '../../constant';
let socketInstense;

class Feeds extends Component {
    constructor(props) {
        super(props);
        const { token } = this.props;
        this.state = {
            feeds: [],
            loggedInUser: {
                subscribe_users: []
            }, userList: []
        };
        socketInstense = socket(token);
        socketInstense.on('intiConfig', (intiConfig) => {
            console.log(intiConfig)
            this.setState(intiConfig);
        });
        socketInstense.on('updatedLloggedInUser', (updatedLloggedInUser) => {
            console.log(updatedLloggedInUser)
            this.setState(updatedLloggedInUser);
        });

        socketInstense.on('newFeed', ({
            newFeed
        }) => {
            let feeds = this.state.feeds.slice(0);
            feeds.unshift(newFeed)
            this.setState({
                feeds
            })
        });

    }

    subscribeUnsubscribeUser(event, subScribeUser) {
        event.preventDefault();
        socketInstense.emit('subscribeUnsubscribeUser', {
            subScribeUser
        });
    }

    postFeed(event) {
        event.preventDefault();
        const form = event.currentTarget;
        socketInstense.emit('postFeed', {
            feed_description: form.elements.feed_description.value,
        });
        form.elements.feed_description.value = '';
    }

    async logout() {
        const {cookies , token} = this.props;
        console.log(this.props)
        await fetch(`${API_DOMAIN}user/logout/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        cookies.remove('token');
        alert('Logout successfully');
        
    }

    render() {
        const { userList, loggedInUser = {
            subscribe_users: []
        }, feeds = [] } = this.state;
        const { name, subscribe_users = [] } = loggedInUser;
        return (
            <React.Fragment>
                <Navbar bg="dark" variant="dark" className="justify-content-between d-flex">
                    <Navbar.Brand >{name}</Navbar.Brand>
                    <Nav>
                        <Button type="button" onClick={()=> this.logout()}>Logout</Button>
                    </Nav>
                </Navbar>

                <div className="d-flex p-2">
                    <div className="p-2 w-75">
                        <Form className="d-flex flex-column" onSubmit={(e) => {
                            this.postFeed(e);
                        }}>
                            <Form.Group controlId="feed_description">
                                <Form.Control type="textarea" placeholder="Enter new Feed" required />
                            </Form.Group>
                            <Button className="text-center" variant="primary" type="submit">
                                Submit
                    </Button>
                        </Form>
                        {feeds.map((feed) => {
                            const { feed_description, created_by, _id } = feed;
                            const {
                                name = ''
                            } = userList.find(user => (
                                user._id === created_by
                            )) || {}
                            return <Card key={_id}>
                                <Card.Body>
                                    <Card.Text>
                                        {feed_description}
                                    </Card.Text>
                                    <Card.Text>{name}</Card.Text>
                                </Card.Body>
                            </Card>
                        })}

                    </div>
                    <div className="p-2">
                        <ListGroup>
                            {
                                userList.map((user) => {
                                    const { _id, name } = user;
                                    return _id === loggedInUser._id ? <React.Fragment key={_id}>


                                    </React.Fragment> : <ListGroup.Item key={_id} className="justify-content-between d-flex align-items-center small">
                                            {name}
                                            <Button type="button"
                                                className="small" size="sm" onClick={(event) => {
                                                    this.subscribeUnsubscribeUser(event, _id)
                                                }} >{
                                                    subscribe_users.findIndex((subscribeUserId) => _id === subscribeUserId) !== -1 ?
                                                        'Unsubscribe' : 'Subscribe'
                                                }</Button></ListGroup.Item>
                                })
                            }
                        </ListGroup></div>
                </div>
            </React.Fragment>
        );
    }
}

export default Feeds;
