# only-latest-cache

Clear the cache with the prefix key specified in GitHub Actions except the most recent one

# Usage

example:

```yaml
- name: Use Node.js
  uses: actions/setup-node@v4
  with:
    node-version: ${{ matrix.node-version }}
    cache: 'pnpm'
- name: Leave only latest cache
  uses: lapla-cogito/only-latest-cache@v1
  with:
    key_prefix: 'node-cache-Linux-pnpm'
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

In this example, this action will delete the cache of Node.js except the last accessed one, which is the cache of the branch ref on which the workflow runs. Make sure that the token passed to GITHUB_TOKEN has write permission to Actions.
