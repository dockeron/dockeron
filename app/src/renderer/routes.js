export default [
  {
    path: '/',
    name: 'home-page',
    component: require('components/HomePageView')
  },
  {
    path: '/container/:containerId',
    name: 'single-container-view',
    component: require('components/HomePageView/SingleContainerView')
  },
  {
    path: '/images',
    name: 'images-view',
    component: require('components/HomePageView/ImagesView')
  },
  {
    path: '*',
    redirect: '/'
  }
]
