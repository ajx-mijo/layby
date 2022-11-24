// React imports
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

// Bootstrap imports
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem'

//Imports
import axios from 'axios'

//Custom imports 
import { getToken } from '../common/Auth.js'
import UploadImage from '../../helpers/UploadImage.js'

const UserProfilePage = () => {
  // ! State
  const [user, setUser] = useState([])
  const [errors, setErrors] = useState(false)
  const [ formData, setFormData ] = useState({
    profileImage: '',
    userBio: '',
  })

  // ! Location
  const { userId } = useParams()

  // ! Execution
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        setUser(data)
      } catch (err) {
        console.log(err)
        setErrors(true)
      }
    }
    getUser()
  }, [userId])

  const handleChange = async (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }


  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const { data } = await axios.put(`/api/users/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setUser(data)
    } catch (err) {
      console.log(err)
    }
  }

  const deleteReview = async (e, locationId, reviewId) => {
    try {
      console.log(locationId, reviewId)
      const response = await axios.delete(`/locations/${locationId}/${reviewId}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
    } catch (err) {
      console.log(err)
    }
  }

  //useEffect(() => console.log('user useEffect ->',user))

  // ! JSX
  return (
    <div className="site-wrapper">
      <>
        <Container className='profile-page-container'>
          <Row className='text-center'>
            <Col md="4" className='text-center'>
              <div className='user-details d-flex flex-column align-items-center'>
                <h3 className="mt-3 mb-5">Your Details</h3>
                <h3>{user.username}</h3>
                <img className='img-thumbnail profile-pic' src={`${user.profileImage}`}></img>
                <UploadImage 
                  imageFormData={formData}
                  setFormData={setFormData}
                />
                <Link onClick={handleSubmit} className='btn align-self-center btn-warning btn-lg mt-3 mb-3'>Upload Pic</Link>
                <textarea
                  className='mt-3 user-bio field'  
                  name="userBio"
                  rows="3"
                  value={formData.userBio}
                  onChange={handleChange}
                >
                </textarea>
                <Link className='btn btn-warning btn-lg mt-3 mb-3align-self-center'>Save</Link>
              </div>
            </Col>
            <Col md="8">
              <h3>Your Reviews</h3>
              <div className='user-reviews'>
                <>
                  {user.reviews ? (
                    <ListGroup className='ms-1'>
                      {user.reviews.map(location => {
                        const { reviews, locationId, locationName, locationImage } = location
                        console.log(reviews)
                        return reviews.map(review => {
                          return (
                            <Link 
                              className="text-decoration-none" 
                              key={review.id} to={`/locations/${locationId}`}>
                              <ListGroupItem className='d-flex review-list list-group-item-action mt-2'>
                                <div>
                                  <img className='list-group-img' src={locationImage}></img>
                                </div>
                                <div className='d-flex flex-column align-items-start ms-3'>
                                  <h4>{locationName}</h4>
                                  <p className='d-none d-sm-block'>{review.text}</p>
                                </div>
                                <div className='d-flex flex-column buttons align-self-start'>
                                  <Link onClick={deleteReview(locationId, review.id)} className='btn' to="">Delete</Link>
                                </div>
                              </ListGroupItem>
                            </Link>
                          )
                        })
                      })}
                    </ListGroup>
                  ) : errors ? (
                    <h2>Error...</h2>
                  ) : (
                    <h2>No reviews</h2>
                  )}
                </>
              </div>
              {/* <div className='user-favourites mt-4'>
                <h3 className="mt-5 mb-5">Your Places</h3>
                <div className='favourite-card-container'>
                  <Row>
                    <Col md="6"  xs="6">
                      <Card className='favourite-card'>
                        <Card.Body>
                          <Card.Img variant='top' src='https://tinyurl.com/5atpj5f8'/>
                          <Card.Title>Location Name</Card.Title>
                          <Card.Subtitle>Country here</Card.Subtitle>
                          <Card.Link>Link to location</Card.Link>
                        </Card.Body>
                      </Card>
                    </Col>
                    
                  </Row>
                </div>
              </div> */}
            </Col>
          </Row>
        </Container>
      </>
    </div>
    
  )
}

export default UserProfilePage