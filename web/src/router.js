import { ConnectedRouter } from 'connected-react-router'
import Layout from 'layouts'
import React, { lazy, Suspense } from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

const routes = [
  // Dashboard
  {
    path: '/dashboard',
    Component: lazy(() => import('pages/dashboard')),
    exact: true,
  },
  {
    path: '/rooms',
    Component: lazy(() => import('pages/rooms')),
    exact: true,
  },
  {
    path: '/classlist',
    Component: lazy(() => import('pages/classlist')),
    exact: true,
  },
  {
    path: '/statistics',
    Component: lazy(() => import('pages/statistics')),
    exact: true,
  },
  {
    path: '/resources',
    Component: lazy(() => import('pages/resources')),
    exact: true,
  },
  {
    path: '/home',
    Component: lazy(() => import('pages/home')),
    exact: true,
  },
  // Auth Pages
  {
    path: '/auth/login',
    Component: lazy(() => import('pages/auth/login')),
    exact: true,
  },
  {
    path: '/privacy',
    Component: lazy(() => import('pages/auth/privacy')),
    exact: true,
  },
  {
    path: '/terms',
    Component: lazy(() => import('pages/auth/terms')),
    exact: true,
  },
  {
    path: '/auth/forgot-password',
    Component: lazy(() => import('pages/auth/forgot-password')),
    exact: true,
  },
  {
    path: '/auth/register',
    Component: lazy(() => import('pages/auth/register')),
    exact: true,
  },
  {
    path: '/auth/lockscreen',
    Component: lazy(() => import('pages/auth/lockscreen')),
    exact: true,
  },
  {
    path: '/auth/404',
    Component: lazy(() => import('pages/auth/404')),
    exact: true,
  },
  {
    path: '/auth/500',
    Component: lazy(() => import('pages/auth/500')),
    exact: true,
  },
]

const mapStateToProps = ({ settings }) => ({
  routerAnimation: settings.routerAnimation,
})

const Router = ({ history, routerAnimation }) => {
  return (
    <ConnectedRouter history={history}>
      <Layout>
        <Route
          render={state => {
            const { location } = state
            return (
              <SwitchTransition>
                <CSSTransition
                  key={location.pathname}
                  appear
                  classNames={routerAnimation}
                  timeout={routerAnimation === 'none' ? 0 : 300}
                >
                  <Switch location={location}>
                    <Route exact path="/" render={() => <Redirect to="/home" />} />
                    {routes.map(({ path, Component, exact }) => (
                      <Route
                        path={path}
                        key={path}
                        exact={exact}
                        render={() => {
                          return (
                            <div className={routerAnimation}>
                              <Suspense fallback={null}>
                                <Component />
                              </Suspense>
                            </div>
                          )
                        }}
                      />
                    ))}
                    <Redirect to="/auth/404" />
                  </Switch>
                </CSSTransition>
              </SwitchTransition>
            )
          }}
        />
      </Layout>
    </ConnectedRouter>
  )
}

export default connect(mapStateToProps)(Router)
