export default [
  {
    path: '/',
    name: 'home-page',
    component: require('components/HomePageView'),
    children: [
      {
        path: '',
        name: 'default',
        component: require('components/HomePageView/ContainersView/ContainersView')
      },
      {
        path: 'containers',
        name: 'containers-view',
        component: require('components/HomePageView/ContainersView/ContainersView')
      },
      {
        path: '/containers/:containerId',
        name: 'single-container-view',
        component: require('components/HomePageView/ContainersView/SingleContainerView')
      },
      {
        path: 'images',
        name: 'images-view',
        component: require('components/HomePageView/ImagesView/ImagesView')
      },
      {
        path: '/images/:imageId',
        name: 'single-image-view',
        component: require('components/HomePageView/ImagesView/SingleImageView')
      },
      {
        path: '/docker-hub',
        name: 'docker-hub-view',
        component: require('components/HomePageView/DockerHubView/DockerHubView')
      }
    ]
  },
  {
    path: '*',
    redirect: '/'
  }
]
