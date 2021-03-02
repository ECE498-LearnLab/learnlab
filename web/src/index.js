import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import 'antd/lib/style/index.less' // antd core styles
import { createUploadLink } from 'apollo-upload-client'
import { routerMiddleware } from 'connected-react-router'
import { createHashHistory } from 'history'
import React from 'react'
import ReactDOM from 'react-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { Provider } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { applyMiddleware, compose, createStore } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
// import { logger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import './components/kit/vendors/antd/themes/dark.less' // dark theme antd components
import './components/kit/vendors/antd/themes/default.less' // default theme antd components
import './global.scss' // app & third-party component styles
import Localization from './localization'
import reducers from './redux/reducers'
import sagas from './redux/sagas'
import Router from './router'
import * as serviceWorker from './serviceWorker'

// apollo client set up
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
})
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
    connectionParams: () => ({
      authToken: localStorage.getItem('token'),
    }),
  },
})
const uploadLink = createUploadLink({
  uri: 'http://localhost:4000/graphql',
})

const requestLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === `OperationDefinition` && definition.operation === `subscription`
  },
  wsLink,
  httpLink,
)

// helper functions for determining if uploadLink is needed
const isFile = value =>
  (typeof File !== 'undefined' && value instanceof File) ||
  (typeof Blob !== 'undefined' && value instanceof Blob)
const isUpload = ({ variables }) => Object.values(variables).some(isFile)

const terminalLink = split(isUpload, uploadLink, requestLink)

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token')
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})
const apolloClient = new ApolloClient({
  link: authLink.concat(terminalLink),
  cache: new InMemoryCache(),
})

// middlewared
const history = createHashHistory()
const sagaMiddleware = createSagaMiddleware()
const routeMiddleware = routerMiddleware(history)
const middlewares = [sagaMiddleware, routeMiddleware]
// if (process.env.NODE_ENV === 'development') {
//   middlewares.push(logger)
// }

// redux
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['selectedClass'],
}
const persistedReducer = persistReducer(persistConfig, reducers(history))
const store = createStore(persistedReducer, compose(applyMiddleware(...middlewares)))
const persistor = persistStore(store)
sagaMiddleware.run(sagas)

ReactDOM.render(
  <ErrorBoundary FallbackComponent={<Redirect to="/auth/500" />}>
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Localization>
            <Router history={history} />
          </Localization>
        </PersistGate>
      </Provider>
    </ApolloProvider>
  </ErrorBoundary>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

export { apolloClient, store, history, persistor }
