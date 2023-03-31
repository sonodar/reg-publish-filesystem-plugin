![version](https://img.shields.io/npm/v/reg-publish-filesystem-plugin)
![LICENSE](https://img.shields.io/npm/l/reg-publish-filesystem-plugin)
![lint](https://github.com/sonodar/reg-publish-filesystem-plugin/actions/workflows/lint.yml/badge.svg)
![test](https://github.com/sonodar/reg-publish-filesystem-plugin/actions/workflows/test.yml/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/sonodar/reg-publish-filesystem-plugin/badge.svg)](https://coveralls.io/github/sonodar/reg-publish-filesystem-plugin)

# reg-publish-filesystem-plugin

Fetch and publish snapshot images to local filesystem.

## Disclaimer

This plugin was developed for local development of the `reg-suit` stack.
It may also be used in production with NFS or FUSE, but this is not the intended use of the implementor.

## Usage

```sh
npm i -D reg-publish-filesystem-plugin
reg-suit prepare -p publish-filesystem
```

## Configure

```ts
{
  path: string;
}
```

## LICENSE

This repository is under [MIT](./LICENSE) license.
