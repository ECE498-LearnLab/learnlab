import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { connect } from 'react-redux'
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap'
import { Helmet } from 'react-helmet'

const mapStateToProps = ({ user }) => ({ userEmail: user.email })

const Settings = ({ userEmail }) => {
  const GET_ADDITIONAL_USER_INFO = gql`
  query getUserByEmail {
    userByEmail(email: ${userEmail}) {
      user {
        id
        first_name
        middle_name
        last_name
        email
        phone_number
      }
    }
  }
`
  console.log(userEmail, '!!!!!!!!!!!!!!!!!!!')
  const { data } = useQuery(GET_ADDITIONAL_USER_INFO)

  if (data) {
    return data
  }

  return (
    <div>
      <Helmet title="Edit Profile" />
      <Form>
        <FormGroup>
          <Label for="firstName">First Name</Label>
          <Input type="text" name="text" id="exampleText" value={data.user.first_name} />
        </FormGroup>
        <FormGroup>
          <Label for="middleName">Middle Name</Label>
          <Input type="text" name="text" id="exampleText" value={data.user.middle_name} />
        </FormGroup>
        <FormGroup>
          <Label for="lastName">Last Name</Label>
          <Input type="text" name="text" id="exampleText" value={data.user.last_name} />
        </FormGroup>
        <FormGroup>
          <Label for="phoneNumber">Phone Number</Label>
          <Input type="text" name="text" id="exampleText" value={data.user.phone_number} />
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail">Email</Label>
          <Input type="email" name="email" id="exampleEmail" value={data.user.email} />
        </FormGroup>
        <FormGroup>
          <Label for="examplePassword">Password</Label>
          <Input
            type="password"
            name="password"
            id="examplePassword"
            value="password placeholder"
          />
        </FormGroup>
        <FormGroup>
          <Label for="exampleFile">File</Label>
          <Input type="file" name="file" id="exampleFile" />
          <FormText color="muted">
            This is some placeholder block-level help text for the above input.
          </FormText>
        </FormGroup>
        <Button>Submit</Button>
      </Form>
    </div>
  )
}

export default connect(mapStateToProps)(Settings)
