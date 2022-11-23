# im-services web客户端

[![OSCS Status](https://www.oscs1024.com/platform/badge/IM-Tools/Im-Services.svg?size=small)](https://www.oscs1024.com/project/IM-Tools/Im-Services?ref=badge_small)


### 技术栈 ：Vue 3 + TypeScript + Vite

### 本地环境配置 `.env.development`
```shell
# 环境名称
VITE_APP_NODE_ENV = 'development'
# 后台访问地址
# VITE_APP_BASE_API = 'http://127.0.0.1:8000/api'
# VITE_APP_WS_API = 'ws://127.0.0.1:8000/im/connect?token='
VITE_APP_BASE_API = 'http://im.pltrue.top/api'
VITE_APP_WS_API = 'ws://im.pltrue.top/im/connect?token='
VITE_APP_CLIENT_ID= '77fc33d207bafb6006a6'
VITE_APP_REDIRECT_URL = 'http://chat.pltrue.top/login?login_type=github'
VITE_APP_GITEE_CLIENT_ID= '1fcf7fa2c24188b2b63366aa8e9ea0aedd0234cf5685489e2be6572eab39eac9'
VITE_APP_GITEE_REDIRECT_URL = 'http://chat.pltrue.top/login?login_type=gitee'
```

### 启动

```shell
yarn install
yarn run dev
```

### 配置 `.env.production`
```shell
# 环境名称
VITE_APP_NODE_ENV = 'production'
# 后台访问地址
VITE_APP_BASE_API = 'http://im.pltrue.top/api'
VITE_APP_WS_API = 'ws://im.pltrue.top/im/connect?token='
VITE_APP_CLIENT_ID= '77fc33d207bafb6006a6'
VITE_APP_REDIRECT_URL = 'http://chat.pltrue.top/login?login_type=github'

VITE_APP_GITEE_CLIENT_ID= '1fcf7fa2c24188b2b63366aa8e9ea0aedd0234cf5685489e2be6572eab39eac9'
VITE_APP_GITEE_REDIRECT_URL = 'http://chat.pltrue.top/login?login_type=gitee'
```

### 打包

```shell
yarn run build
```