
import uuidV4 from "uuid/v4";

const list = [
  {
    id: uuidV4(),
    label: 'freeText',
    name: '文本',
    type: 'free',
    icon: 'icon-text',
    previewComponent: 'FreeText',
    settingComponent: 'FreeTextSetting',
    version: 1,
    explain: '可自定义文本内容，编辑想要表达的文字简述，例如栏目标题或活动简介等，点击组件进行内容、颜色、样式、字号更改，样式可通过周边八个点自定义拖动编辑。',
    setting: {
      text: '文本内容',
      color: '#333333',
      size: '14',
      style: {
        bold: false,
        italic: false,
        underline: false,
        align: 'left',  // left center right
        lineHeight: 20
      },
      link: {},
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      z: 1
    }
  }, {
    id: uuidV4(),
    label: 'freeImage',
    name: '图片',
    type: 'free',
    icon: 'icon-image',
    previewComponent: 'FreeImage',
    settingComponent: 'FreeImageSetting',
    version: 1,
    explain: '点击组件，将想展示在自由容器内的图片在右侧编辑框上传，该图片可自由拉伸至需要的大小,可附带链接。',
    setting: {
      imageID: 'default',
      imageUrl: 'https://qxtodo.com/editor/animation_wallpaper.jpg',
      link: {},
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      z: 1
    }
  }, {
    id: uuidV4(),
    label: 'freeBtn',
    name: '按钮',
    type: 'free',
    icon: 'icon-button-handle',
    previewComponent: 'FreeBtn',
    settingComponent: 'FreeBtnSetting',
    version: 1,
    explain: '通用的功能组件，可以提交、编辑、删除、跳转等，可自定义按钮名称，点击组件可更改颜色、样式、字号及附带链接，链接后点击即可进入页面。',
    setting: {
      text: '按钮',
      color: '#ffffff',
      bg: '#409eff',
      size: '14',
      style: 'primary', // primary plain primaryRound plainRound
      link: {},
      width: 100,
      height: 40,
      x: 0,
      y: 0,
      z: 1
    }
  }, {
    id: uuidV4(),
    label: 'freeOmnipotent',
    name: '万能热区',
    type: 'free',
    icon: 'icon-omnipotent',
    previewComponent: 'FreeOmnipotent',
    settingComponent: 'FreeOmnipotentSetting',
    version: 1,
    explain: '万能热区是可覆盖在自由容器内的图片、文本组件之上透明区域，可对一张固定的图设置不同区域的跳转。',
    setting: {
      link: {},
      width: 100,
      height: 40,
      x: 0,
      y: 0,
      z: 1
    }
  }, {
    id: uuidV4(),
    label: 'freeContainer',
    name: '自由容器',
    type: 'freeContainer',
    icon: 'icon-container',
    previewComponent: 'FreeContainer',
    settingComponent: 'FreeContainerSetting',
    version: 1,
    explain: '自由容器组件内目前仅支持添加文本、图片、按钮及万能热区。',
    setting: {
      height: '300',
      name: '自由容器',
      hideName: false,
      marginBottom: 16,
      children: []
    }
  }, {
    id: uuidV4(),
    label: 'carousel',
    name: '轮播图',
    icon: 'icon-carousel',
    type: 'normal',
    previewComponent: 'Carousel',
    settingComponent: 'CarouselSetting',
    version: 1,
    explain: '小程序首页宣传图片，添加后在小程序平台自主轮换播放，点击组件最多可添加四张图片，所添加图片可附带链接进行页面跳转，播放间隔时间也可自定义设置。',
    setting: {
      height: '200',
      interval: 3,
      marginBottom: 16,
      list: [
        {
          id: uuidV4(),
          imageID: "default",
          imageUrl: 'https://qxtodo.com/editor/animation_wallpaper.jpg',
          link: {}
        }
      ]
    }
  }, {
    id: uuidV4(),
    label: 'goodsList',
    name: '商品列表',
    icon: 'icon-goods',
    type: 'normal',
    previewComponent: 'GoodsList',
    settingComponent: 'GoodsListSetting',
    version: 1,
    explain: '用于展示商品，点击组件，右侧编辑框可自定义图片及名称，商品添加可选择自动或手动添加。',
    setting: {
      name: '商品列表',
      hideName: false,
      marginBottom: 16,
      style: 'default', // 样式
      chooseMode: 'auto', // 选择方式 hand / auto
      group: [],  // 分组
      sort: 'createTime', // 排序 createTime - 按上架时间排序；  priceDescending - 按价格降序； priceAscending - 按价格升序
      numberType: 'all',  // 数量类型 all- 全部； custom - 自定义
      number: 1,
      autoList: [
        {
          id: 'default-'+uuidV4(),
          picture: 'https://qxtodo.com/editor/animation_wallpaper.jpg',
          name: '商品名称',
          price: 8.88,
          type: '商品类型'
        }
      ],
      handList: [
        {
          id: 'default-'+uuidV4(),
          picture: 'https://qxtodo.com/editor/animation_wallpaper.jpg',
          name: '商品名称',
          price: 8.88,
          type: '商品类型'
        }
      ]
    }
  }, {
    id: uuidV4(),
    label: 'graphicNav',
    name: '图文导航',
    icon: 'icon-graphicNav',
    type: 'normal',
    previewComponent: 'GraphicNav',
    settingComponent: 'GraphicNavSetting',
    version: 1,
    explain: '多个菜单导航，可跳转到不同的页面；',
    setting: {
      marginBottom: 16,
      list: [
        {
          id: uuidV4(),
          imageID: "default",
          imageUrl: 'https://cdn.qinxus.com/animation_gril_banner_2.jpg',
          title: '标题',
          link: {}
        }
      ]
    }
  }, {
    id: uuidV4(),
    label: 'navbar',
    name: '底部导航',
    type: 'navbar',
    icon: 'icon-navbar',
    previewComponent: 'Navbar',
    settingComponent: 'NavbarSetting',
    version: 1,
    setting: {
      list: [
        {
          id: '1',
          icon: 'icon-home',
          text: 'home'
        }
      ]
    }
  }
];

export default list;