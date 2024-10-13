# only-latest-cache

Clear the cache with the prefix key specified in GitHub Actions except the most recent one

# Usage

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
```
