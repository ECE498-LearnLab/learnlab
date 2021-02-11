export default async function getMenuData() {
  return [
    {
      title: 'Dashboard',
      key: 'dashboard',
      icon: 'fe fe-home',
      url: '/dashboard/',
      // roles: ['admin'], // set user roles with access to this route
    },
    {
      title: 'Resources',
      key: 'resources',
      icon: 'fe fe-book',
      url: '/resources/',
      // roles: ['admin'], // set user roles with access to this route
    },
    {
      title: 'Rooms',
      key: 'rooms',
      icon: 'fe fe-tv',
      url: '/rooms/',
      // roles: ['admin'], // set user roles with access to this route
    },
    {
      title: 'Classlist',
      key: 'classlist',
      icon: 'fe fe-users',
      url: '/classlist/',
      // roles: ['admin'], // set user roles with access to this route
    },
  ]
}
