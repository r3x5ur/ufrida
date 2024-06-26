# uFrida

[![NPM version][npm-v-image]][npm-link]
[![NPM Downloads][npm-dm-image]][npm-link]

Node.js bindings for [Frida](https://frida.re).

## 更改说明
1. 去除繁琐的编译环境配置
2. 优化打包体积
3. 增加代码提示
4. [示例程序](./example)


## Depends

- Node.js 12 or newer

## Install

- 安装方法:

- 需要先配置代理，墙内速度极慢
  - windows `set http_proxy=http://127.0.0.1:7890`
  - *nix `export http_proxy=http://127.0.0.1:7890`


```shell
npm install ufrida
# or
yarn add ufrida
# or
pnpm add ufrida
```

## Examples

- Follow [Setting up the experiment](https://frida.re/docs/functions/) to
  produce a binary.
- Run the binary.
- Take note of the memory address the binary gives you when run.
- Run any of the examples, passing the name of the binary as a parameter, and
  the memory address as another.

[npm-link]: https://www.npmjs.com/package/ufrida
[npm-v-image]: https://img.shields.io/npm/v/frida.svg
[npm-dm-image]: https://img.shields.io/npm/dm/frida.svg
