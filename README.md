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
