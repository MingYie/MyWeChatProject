// Components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   * 1页面.js 文件中存放事件回调函数的时候存放在data同层级下! !
    2组件.js文件中存放事件回调函数的时候必须要存在在methods中! !
   */
  methods: {
    handleItemTap(e) {
      //获取索引 这里不知道为什么index要必须加{}TAT
      const { index } = e.currentTarget.dataset;

      //子向父传递数据，触发父组件中的自定义事件，同时传递数据给父组件
      // this.triggerEvent("父组件自定义事件的名称",要传递的参数);
      this.triggerEvent("itemChange", { index });

    }
  }
})
