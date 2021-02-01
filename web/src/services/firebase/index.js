import { gql } from '@apollo/client'
import { notification } from 'antd'
import firebase from 'firebase/app'
import 'firebase/auth'
import { apolloClient } from 'index'

const CREATE_TEACHER = gql`
  mutation createTeacher($first_name: String!, $last_name: String!, $email: String!) {
    createTeacher(first_name: $first_name, last_name: $last_name, email: $email) {
      user_id
      success
      message
    }
  }
`

const CREATE_STUDENT = gql`
  mutation createStudent(
    $first_name: String!
    $last_name: String!
    $email: String!
    $created_at: Date
    $parent_email: String
  ) {
    createStudent(
      first_name: $first_name
      last_name: $last_name
      email: $email
      created_at: $created_at
      parent_email: $parent_email
    ) {
      user_id
      success
      message
    }
  }
`
const GET_USER_BY_EMAIL = gql`
  query getUserByEmail($email: String!) {
    userByEmail(email: $email) {
      user {
        id
        first_name
        last_name
        email
        role
      }
    }
  }
`

const firebaseConfig = {
  apiKey: 'AIzaSyDqWf-FmQC1aQU3SMRT6Z2i7--6l_ltmW0',
  authDomain: 'learnlab-ef56a.firebaseapp.com',
  projectId: 'learnlab-ef56a',
  storageBucket: 'learnlab-ef56a.appspot.com',
  messagingSenderId: '566239504531',
  appId: '1:566239504531:web:3d6b3e60d14ddabc0e8566',
}

firebase.initializeApp(firebaseConfig)

export const firebaseAuth = firebase.auth()

// to-do create mutation to update last login_date
export async function login(email, password) {
  return firebaseAuth
    .signInWithEmailAndPassword(email, password)
    .then(() => true)
    .catch(error => {
      notification.warning({
        message: error.code,
        description: error.message,
      })
    })
}

export async function register(role, first_name, last_name, email, password) {
  return firebaseAuth
    .createUserWithEmailAndPassword(email, password)
    .then(async response => {
      if (response.user) {
        await response.user.getIdToken().then(token => {
          localStorage.setItem('token', token)
        })
        await apolloClient
          .mutate({
            mutation: role === 'INSTRUCTOR' ? CREATE_TEACHER : CREATE_STUDENT,
            variables: {
              first_name,
              last_name,
              email,
            },
          })
          .then(result => {
            if (result.data.success) {
              return true
            }
            return false
          })
          .catch(error => {
            notification.warning({
              message: error.code,
              description: error.message,
            })
          })
      }
      return true
    })
    .catch(error => {
      notification.warning({
        message: error.code,
        description: error.message,
      })
    })
}

export async function currentAccount() {
  let userLoaded = false
  function getCurrentUser(auth) {
    return new Promise((resolve, reject) => {
      if (userLoaded) {
        resolve(firebaseAuth.currentUser)
      }
      const unsubscribe = auth.onAuthStateChanged(user => {
        userLoaded = true
        unsubscribe()
        const getUserData = async () => {
          if (user) {
            user.getIdToken().then(token => {
              localStorage.setItem('token', token)
            })
            const {
              data: { userByEmail },
            } = await apolloClient.query({
              query: GET_USER_BY_EMAIL,
              variables: {
                email: user.email,
              },
            })

            if (userByEmail.user != null) {
              const mergedUser = Object.assign(user, {
                id: userByEmail.user.id,
                first_name: userByEmail.user.first_name,
                last_name: userByEmail.user.last_name,
                role: userByEmail.user.role,
              })
              return mergedUser
            }
          }
          return user
        }
        resolve(getUserData())
      }, reject)
    })
  }
  return getCurrentUser(firebaseAuth)
}

export async function logout() {
  return firebaseAuth.signOut().then(() => {
    apolloClient.resetStore()
    return true
  })
}
