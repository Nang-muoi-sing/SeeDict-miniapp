export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/search/index',
    'pages/word/index',
  ],
  permission: {
    'scope.writePhotosAlbum': {
      desc: '用于将当前词条海报保存到本地相册',
    },
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
