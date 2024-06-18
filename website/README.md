# React Browser Tests Website

This is a NextJS website with the documentation and tests for the React Browser Tests package. It can be used for development purposes, and to locally play with the package. Here's how to set things up: 

### Dev setup

In this folder, run `yarn` to install the dependencies. Next, we will link the React Browser Tests package with this website. Linking the package with the website will make any changes in the `package` folder automatically available on the website. Here are the steps:

1. In the `package` folder, run `yarn link`
2. Run `yarn run watch`
3. On the `website` folder, run `yarn link "react-browser-tests"`

Finally, on the `website` folder, we can run the website with `yarn dev`. If the linking was done correctly, and watch mode is active, any changes in the `package` folder will be automatically available on the website.
