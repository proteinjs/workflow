# multi-repo strategy

1. components becomes a meta-repo with git submodules to each component's repo
  - make sure submodules point at a branch
    [submodule "path/to/submodule"]
    path = path/to/submodule
    url = https://example.com/submodule.git
    branch = main
2. yarn workspaces can be used to manage local symlinking while still preserving versioned dependencies. install dependencies of all packages in the meta repo with `yarn install`
  - the meta repo should have a package.json with the following properties to work with yarn workspaces
  ```
  {
  "private": true,
  "workspaces": [
      "components/*"
    ]
  }
  ```
3. yarn can be used to build each package with `yarn workspaces foreach --exclude typescript-parser run build`
4. yarn can be used to run watch or test scripts as well, and automatically skips packages that don't have the script defined
5. each component will have its own build/publish pipeline
6. each component repo will use dependabot to monitor and generate pull requests to bump dependency versions as they're published


# Dev meta-repo workflow

0. (optional) Check to see if the meta repo needs to be updated: `git submodule status`
1. Pull the meta repo: `git pull origin main`
2. Update submodules to point to head: `git submodule update --init --recursive --remote`

Then just treat each submodule as a normal repo, currently pointing to main.

Note: There's no need to update the meta-repo with submodule changes after pushing changes to a submodule; the meta-repo has workflows in github to monitor its child repos and update itself to point to the latest commit when the child repo changes.

# Creating a new proteinjs meta-repo repo

00. Make sure all dependencies necessary for prod build are dependencies, not dev dependencies
0. Create a new repo and enable github actions
1. Clone an existing proteinjs repo
2. Update remotes to point to new repo `git remote set-url origin new-url`
3. Delete contents of packages/ and lock files
4. Create a new package in its own directory within packages/
5. Update the root package.json with the name of the repo
6. Replace any local dependency file path references (file:../pkga) with the version of the dependency package (yarn will handle linking)
7. Remove typeRoots property from tsconfig.json in each package (so it defaults to finding types in the root node_modules/)
8. mark each scoped package as public in the package.json
  ```
  "publishConfig": {
    "access": "public"
  },
  ```
9. (optional) Customize the .github/workflows/build.js.yml as needed
10. Execute the build workflow in order locally to confirm it works