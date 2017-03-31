export default [
  {
    path: '/',
    name: 'home-page',
    component: require('components/HomePageView')
  },
  {
    path: '/container/:containerId',
    name: 'single-container',
    component: require('components/HomePageView/SingleContainerView')
  },
  {
    path: '/containers',
    name: 'containers-view',
    component: require('components/HomePageView/ContainersView')
  },
  {
    path: '*',
    redirect: '/'
  }
]
