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
      title: 'Classroom',
      key: 'classroom',
      icon: 'fe fe-tv',
      url: '/classroom/',
      // roles: ['admin'], // set user roles with access to this route
    },
  ]
}
