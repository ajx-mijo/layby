
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


import Col from 'react-bootstrap/Col'
import { isAuthenticated } from './Auth'


const ReviewField = () => {

  const navigate = useNavigate()

  const [formFields, setFormFields] = useState({
    review: '',
    rating: null,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/login', formFields)
      navigate('/')
    } catch (err) {
      console.log(err)
    }
    console.log('form submitted')
  }

  const handleChange = (e) => {
    const updatedFormFields = { ...formFields }
    updatedFormFields[e.target.name] = e.target.value
    setFormFields(updatedFormFields)
    // ! if there's an error, set to an empty string
  }


  return (
    <Col md="6">
      {isAuthenticated() ?
        <form onSubmit={handleSubmit}>
          <p>Leave Review:</p>
          <input
            required
            className='form-control'
            type="text"
            name="review"
            onChange={handleChange}
            placeholder="Type your review here"
            value={formFields.review}
          />
          <button className='btn btn-primary'>Submit</button>
        </form>
        :
        <></>
      }
      <div className='current-reviews'>
        Reviews
      </div>
    </Col>
  )
}

export default ReviewField
