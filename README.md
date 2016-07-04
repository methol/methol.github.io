# blog
http://tuzhihao.com



打包部署
`hexo clean`
`hexo generate`
`gulp`
切换到当前目录，执行`qrsync.exe qiniu.json`可以上传文件到七牛空间
linux 下执行 `./qrsync qiniu.json`


第一次使用
```
# 全局安装gulp
npm install --global gulp

# 全局安装hexo
npm install --global hexo

# 安装项目依赖
npm install --save-dev

```