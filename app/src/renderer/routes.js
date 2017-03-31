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
<<<<<<< HEAD
    path: '/containers',
    name: 'containers-view',
    component: require('components/HomePageView/ContainersView')
=======
    path: '/images',
    name: 'images-view',
    component: require('components/HomePageView/ImagesView')
>>>>>>> master
  },
  {
    path: '*',
    redirect: '/'
  }
]
