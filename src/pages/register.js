import React, { useEffect, useState } from 'react'
import Directual from 'directual-api';
import { useAuth } from '../auth'
import { Loader } from '../components/loader/loader';
import md5 from 'md5-hash'
import { Link } from 'react-router-dom'

// Example of posting data to Directual

// Connect to Directual api
const api = new Directual({ apiHost: '/' })

export default function Register() {

  // API-endpoint details
  const dataStructure = 'reg_requests' // todo: write here sysname of your data structure
  const endpoint = 'register' // todo: write here Method name of your API-endpoint

  // Connect authentication context
  const auth = useAuth();

  // Hooks for handling state
  const [response, setResponse] = useState(); // API response
  const [status, setStatus] = useState(); // Request status
  const [badRequest, setBadRequest] = useState(); // API error message
  const [loading, setLoading] = useState(false); // Loader
  const [showForm, setShowForm] = useState(true); // Show/hide the form
  const [formPayload, setFormPayload] = useState({}); // Data to send. Here we can add userID: auth.user by default

  // Reset the form
  const resetForm = () => {
    setResponse()
    setStatus()
    setBadRequest()
    setShowForm(true)
    setFormPayload({}) // Don't forget to include userID: auth.user, if needed
  }

  const editForm = () => {
    setResponse()
    setStatus()
    setBadRequest()
    setShowForm(true)
  }

  // POST-request
  function postData() {
    setLoading(true)
    setShowForm(false)
    api
      // Data structure
      .structure(dataStructure)
      // POST request + payload + query params:
      .setData(endpoint, formPayload,
        { sessionID: auth.sessionID })
      .then((response) => {
        setResponse(response.result)
        setStatus(response.status)
        setLoading(false)
      })
      .catch((e) => {
        // handling errors
        setLoading(false)
        console.log(e.response)
        setBadRequest({
          httpCode: e.response.status,
          msg: e.response.data.msg
        })
      })
  }

  return (
    <div className="content">
      <h1>Register</h1>
      {loading && <Loader />}
      {showForm &&
        <form onSubmit={postData}>

          <input type="text" value={formPayload.email} placeholder="Your email" onChange={(e) => {
            setFormPayload({ ...formPayload, 'email': e.target.value })
          }} />
          <p className="tip">This will be your login</p>

          <input type="text" value={formPayload.name} placeholder="Name" onChange={(e) => {
            setFormPayload({ ...formPayload, 'name': e.target.value })
          }} />
          <div className="twitter">
            <input type="text" value={formPayload.twitter} placeholder="Twitter account" onChange={(e) => {
              setFormPayload({ ...formPayload, 'twitter': e.target.value })
            }} /></div>
          <p className="tip">I'll tweet thank you</p>

          <input type="password" placeholder="Password" onChange={(e) => {
            setFormPayload({ ...formPayload, 'pass': md5(e.target.value) })
          }} />

          <input type="password" placeholder="Repeat password" onChange={(e) => {
            setFormPayload({ ...formPayload, 're_pass': md5(e.target.value) })
          }} />

          <button type="submit">Submit</button>
        </form>
      }

      {response && (response[0].is_valid) && <div>
        <p><b>All right!</b></p>
        <p>You have been signed up</p>
        <Link to="/login">
          <button>Log in</button>
        </Link>
      </div>}

      {response && (!response[0].is_valid) &&
        <div class="error">
          <b>Not good!</b>
          <p>Response: <code>{response[0].error}</code></p>
          <button onClick={editForm}>
            Edit my data
          </button>
        </div>
      }

      {/* Something went wrong */}
      {badRequest && <div class="error">
        <b>{badRequest.httpCode} error</b>
        {(badRequest.httpCode == '400') &&
          <p>API-endpoint is not configured properly.</p>}
        {(badRequest.httpCode == '403') &&
          <p>You have to be logged in to submit this form.</p>}
        <p><code>{badRequest.msg}</code></p>
        <button onClick={editForm}>
            Edit my data
          </button>
      </div>}

    </div>
  )
}