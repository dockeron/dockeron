export default [
  {
    path: '/',
    name: 'home-page',
    component: require('components/HomePageView'),
    children: [
      {
        path: '',
        name: 'default',
        component: require('components/ContainersView/ContainersView')
      },
      {
        path: 'containers',
        name: 'containers-view',
        component: require('components/ContainersView/ContainersView')
      },
      {
        path: '/containers/:containerId',
        name: 'single-container-view',
        component: require('components/ContainersView/SingleContainerView')
      },
      {
        path: 'images',
        name: 'images-view',
        component: require('components/ImagesView/ImagesView')
      },
      {
        path: '/images/:imageId',
        name: 'single-image-view',
        component: require('components/ImagesView/SingleImageView')
      },
      {
        path: 'volumns',
        name: 'volumns-view',
        component: require('components/VolumnsView/VolumnsView')
      },
      {
        path: 'plugins',
        name: 'plugins-view',
        component: require('components/PluginsView/PluginsView')
      },
      {
        path: '/docker-hub',
        name: 'docker-hub-view',
        component: require('components/DockerHubView/DockerHubView')
      }
    ]
  },
  {
    path: '*',
    redirect: '/'
  }
]
