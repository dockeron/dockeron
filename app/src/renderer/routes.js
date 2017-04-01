export default [
  {
    path: '/',
    name: 'home-page',
    component: require('components/HomePageView'),
    children: [
      {
        path: '',
        name: 'default',
        component: require('components/HomePageView/ContainersView')
      },
      {
        path: 'containers',
        name: 'containers-view',
        component: require('components/HomePageView/ContainersView')
      },
      {
        path: 'images',
        name: 'images-view',
        component: require('components/HomePageView/ImagesView')
      }
    ]
  },
  {
    path: '/containers/:containerId',
    name: 'single-container-view',
    component: require('components/HomePageView/SingleContainerView')
  },
  {
    path: '/images/:imageId',
    name: 'single-image-view',
    component: require('components/HomePageView/SingleImageView')
  },
  {
    path: '*',
    redirect: '/'
  }
]
