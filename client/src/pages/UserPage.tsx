import { Button, Row, Col, Card, Layout } from "antd";
import { useQuery } from '@apollo/client';
import { Link } from "react-router-dom";
import AvatarPic from "../assets/Avatar_Bananas.png";
import Auth from "../utils/auth";

import {QUERY_ME} from '../utils/queries.js';


const { Content } = Layout;

const UserPage = () => {
  const { loading: userLoading, data } = useQuery(QUERY_ME)


  if (userLoading) return <p>Loading...</p>;
  // if (userError) return <p>Error loading user data: {userError.message}</p>;

  const { username } = data?.me || {};
  // console.log(username);

  // Check if user is logged in
  const isLoggedIn = Auth.loggedIn(); // Assuming this method returns true/false

  if (!isLoggedIn) {
    return (
      <div className="containerPage">
        <Card
          style={{
            width: 400,
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#f0f2f5",
          }}
        ><h2 style={{ color: "yellow", background: "black", borderRadius: "10px", }}>Whoah! You've gone BANANAS! Please log in before viewing profile 🍌</h2>
          <iframe
            src="https://giphy.com/embed/H8uuXYln5pxVVLFn7k"
            height="270"
            frameBorder="0"
            allowFullScreen
            title="Bananas GIF"
            style={{ marginBottom: "16px", width: "100%" }}
          ></iframe>
          <Link to="/">
            <Button type="primary">Go to Login Page</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Render UserPage content if logged in
  return (
    <>
      <div className="backgroundStyle"></div>
      <div className="containerPage">
        <Content>
          <Row justify="center" gutter={[0, 16]} style={{ marginTop: '-60px' }}>
            <Col xs={24} md={12} lg={10}>
              <Card
                className="text-center"
                bordered
                style={{ boxShadow: '0 4px 12px' }}
                cover={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center', 
                      height: '550px',   
                    }}
                  >
                    <img
                      alt="avatar picture"
                      src={`${AvatarPic}`}
                      className = 'hoverAvatar'
                      style={{
                        width: '500px',       
                        height: '500px',
                        objectFit: 'contain',
                        display: 'block',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  </div>
                }
              >
                <Card.Meta
                  title={username|| "User"}
                  description={
                    <>
                      {/* <p className='userBio'>This is my Bio!</p> */}
                      <p className='extraText'>Let's Battle!</p>
                    </>
                  }
                  style={{ textAlign: 'center'}}
                />
                <div style={{ marginTop: '20px' }}>
                  <Link to="/Search">
                    <Button type="primary" block size="large" className='customButton'>
                      Search for Cards
                    </Button>
                  </Link>
                </div>
              </Card>
            </Col>
          </Row>
          <Row justify="center" style={{ marginTop: "30px" }}>
            <Col xs={24} md={16}>
              <Row gutter={[16, 16]} justify="space-around">
                <Col xs={12}>
                  <Link to="/MyCollection">
                    <Button
                      type="default"
                      block
                      size="large"
                      className="customButton"
                      style={{ boxShadow: "0 4px 12px" }}
                    >
                      Card Collection
                    </Button>
                  </Link>
                </Col>

                <Col xs={12}>
                  <Link to="/MyDecks">
                    <Button
                      type="default"
                      block
                      size="large"
                      className="customButton"
                      style={{ boxShadow: "0 4px 12px" }}
                    >
                      My Decks
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Col>
          </Row>
        </Content>
      </div >
    </>
  );
};

export default UserPage;
