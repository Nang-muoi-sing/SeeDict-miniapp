import type { UserConfigExport } from "@tarojs/cli"

export default {
  env: {
    NODE_ENV: '"development"',
    TARO_APP_API_BASE_URL: '"https://seedict.com"'
  },
  mini: {},
  h5: {}
} satisfies UserConfigExport<'vite'>
