import * as Route from '../renderer/js/constants/RouteConstants'

export default [
  {
    path: Route.HOME_PAGE_PATH,
    name: Route.HOME_PAGE_NAME,
    component: require('components/HomePageView'),
    children: [
      {
        path: Route.DEFAULT_VIEW_PATH,
        name: Route.DEFAULT_VIEW_NAME,
        component: require('components/ContainersView/ContainersView')
      },
      {
        path: Route.CONTAINERS_VIEW_PATH,
        name: Route.CONTAINERS_VIEW_NAME,
        component: require('components/ContainersView/ContainersView')
      },
      {
        path: Route.SINGLE_CONTAINER_VIEW_PATH,
        name: Route.SINGLE_CONTAINER_VIEW_NAME,
        component: require('components/ContainersView/SingleContainerView')
      },
      {
        path: Route.IMAGES_VIEW_PATH,
        name: Route.IMAGES_VIEW_NAME,
        component: require('components/ImagesView/ImagesView')
      },
      {
        path: Route.SINGLE_IMAGE_VIEW_PATH,
        name: Route.SINGLE_IMAGE_VIEW_NAME,
        component: require('components/ImagesView/SingleImageView')
      },
      {
        path: Route.VOLUMES_VIEW_PATH,
        name: Route.VOLUMES_VIEW_NAME,
        component: require('components/VolumesView/VolumesView')
      },
      {
        path: Route.SINGLE_VOLUME_VIEW_PATH,
        name: Route.SINGLE_VOLUME_VIEW_NAME,
        component: require('components/VolumesView/SingleVolumeView')
      },
      {
        path: Route.NETWORKS_VIEW_PATH,
        name: Route.NETWORKS_VIEW_NAME,
        component: require('components/NetworksView/NetworksView')
      },
      {
        path: Route.SINGLE_NETWORK_VIEW_PATH,
        name: Route.SINGLE_NETWORK_VIEW_NAME,
        component: require('components/NetworksView/SingleNetworkView')
      },
      {
        path: Route.PLUGINS_VIEW_PATH,
        name: Route.PLUGINS_VIEW_NAME,
        component: require('components/PluginsView/PluginsView')
      },
      {
        path: Route.DOCKER_HUB_VIEW_PATH,
        name: Route.DOCKER_HUB_VIEW_NAME,
        component: require('components/DockerHubView/DockerHubView')
      }
    ]
  },
  {
    path: '*',
    redirect: '/'
  }
]
