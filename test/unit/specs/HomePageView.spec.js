import Vue from 'vue'
import HomePageView from 'renderer/components/HomePageView'

describe('HomePageView.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: h => h(HomePageView)
    }).$mount()

    expect(vm.$el.querySelector('.layout-copy').textContent).to.contain('2017-2018 &copy; Dockeron')
  })
})
