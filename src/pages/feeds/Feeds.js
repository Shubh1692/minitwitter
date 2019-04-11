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
        /**
         * Connect socket using logged in user token
        */
        socketInstense = socket(token);
        /**
         * Get Feeds and logged in user detail at socket connect
        */
        socketInstense.on('intiConfig', (intiConfig) => {
            console.log(intiConfig)
            this.setState(intiConfig);
        });

        /**
         * Get new feeds when successfully subscribe or unsubscribe user in db
        */
        socketInstense.on('updatedLloggedInUser', (updatedLloggedInUser) => {
            console.log(updatedLloggedInUser)
            this.setState(updatedLloggedInUser);
        });

        /**
         * Get new feed when successfully saved feed in db from logged in user or subscribed user
        */
        socketInstense.on('newFeed', ({
            newFeed
        }) => {
            let feeds = this.state.feeds.slice(0);
            feeds.unshift(newFeed)
            this.setState({
                feeds
            })
        });

        /**
         * logout user if token expire at run time
        */
        socketInstense.on("error", (error) => {
            if (error.type == "UnauthorizedError" || error.code == "invalid_token") {
                this.logout();
            }
        });
    }

    /**
     * @name subscribeUnsubscribeUser
     * @description
     * This method used to emit socket event to subscribe or unsubscribe user
     * @param event click event object
     * @param subScribeUser subscribe or unsubscribe user id
    */
    subscribeUnsubscribeUser(event, subScribeUser) {
        event.preventDefault();
        socketInstense.emit('subscribeUnsubscribeUser', {
            subScribeUser
        });
    }

    /**
     * @name subscribeUnsubscribeUser
     * @description
     * This method used to emit socket event to add new feed in db
     * @param event form event object
    */
    postFeed(event) {
        event.preventDefault();
        const form = event.currentTarget;
        socketInstense.emit('postFeed', {
            feed_description: form.elements.feed_description.value,
        });
        form.elements.feed_description.value = '';
    }

    /**
     * @name logout
     * @description
     * This method used to remove token from cookies and remove session in backend
    */
    async logout() {
        const { cookies, token } = this.props;
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

    /**
     * @name componentWillUnmount
     * @description
     * This method used to disconnect socket event on component distroy
    */
    componentWillUnmount() {
        socketInstense.disconnect();
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
                        <Button type="button" onClick={() => this.logout()}>Logout</Button>
                    </Nav>
                </Navbar>

                <div className="d-flex p-2">
                    <div className="p-2 w-75">
                        <Form className="d-flex flex-column" onSubmit={(e) => {
                            this.postFeed(e);
                        }}>
                            <Form.Group controlId="feed_description">
                                <Form.Control type="textarea" placeholder="Enter new feed..." required />
                            </Form.Group>
                            <Button className="text-center" variant="primary" type="submit">
                                Post Feed
                            </Button>
                        </Form>
                        {feeds.map((feed) => {
                            const { feed_description = '', created_by = '', _id = '' } = feed;
                            const {
                                name = ''
                            } = userList.find(user => (
                                user._id === created_by
                            )) || {}
                            return <Card className="mt-2" key={_id}>
                                <Card.Body>
                                    <Card.Text className="small d-flex flex-column">
                                        <strong>
                                            {name}
                                        </strong>
                                        <span>
                                            {feed_description}
                                        </span>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        })}


                    </div>
                    <div className="p-2 w-25">
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
