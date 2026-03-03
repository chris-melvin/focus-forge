# CI/CD Setup

## GitHub Actions Workflows

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main, master, develop ]
  pull_request:
    branches: [ main, master, develop ]

jobs:
  test-shared:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: packages/shared
    
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    - run: npm install
    - run: npm run lint
    - run: npm run build

  test-web:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: apps/web
    
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    - run: |
        cd ../../packages/shared
        npm install
        npm run build
        cd ../../apps/web
        npm install
    - run: npm run lint
    - run: npm run build

  test-mobile:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: apps/mobile
    
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    - run: |
        cd ../../packages/shared
        npm install
        npm run build
        cd ../../apps/mobile
        npm install
    - run: npx tsc --noEmit
```

Create `.github/workflows/deploy-web.yml`:

```yaml
name: Deploy Web

on:
  push:
    branches: [ main, master ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - run: |
        cd packages/shared
        npm install
        npm run build
        cd ../../apps/web
        npm install
    
    - run: cd apps/web && npm run build
    
    - uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./apps/web/dist
```

## Setup Instructions

1. Go to your GitHub repository Settings > Pages
2. Set Source to "Deploy from a branch"
3. Select "gh-pages" branch
4. Add these workflows via GitHub web UI or with a token that has `workflow` scope
