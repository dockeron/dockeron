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
    path: '*',
    redirect: '/'
  }
]
