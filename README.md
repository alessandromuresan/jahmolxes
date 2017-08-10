## How to deploy to GitHub Pages

1. Checkout the `gh-pages` branch
2. Reset it hard to the last commit common with master (this usually means a regular `git reset --hard HEAD~1`)
3. Rebase `gh-pages` on top of `master`
4. Run `npm run build:prod`
5. Delete everything in the root folder **except** these items:
  - `dist`
  - `CNAME`
  - `node_modules`
  - `.gitignore`
6. Copy everything inside the `dist` folder to the root folder
7. Delete the `dist` folder
8. Force push the `gh-pages` branch
