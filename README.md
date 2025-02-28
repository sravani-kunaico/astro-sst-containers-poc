# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Steps to Integrate SST and deploy to Fargate Cluster

SST is a framework that makes it easy to build modern full-stack applications on your own infrastructure.

Pre-Requisites:
---------------
- Node installed
- Astro project created
- AWS credentials configured
- Docker and Docker Desktop installed

Steps:
------
1. Once Astro project is created, cd into current project
2.  Now initialize SST in your application
        
        npx sst@latest init
3. Once SST is initialized, it will add new file sst.config.ts, sst-env.d.ts, modify tsconfig.json and add sst to package.json.
4. The sst.config.ts file is the main configuration file for SST, which is a framework for deploying serverless applications on AWS. It defines infrastructure and deployment settings.
5. It will also ask to update astro.config.mjs. This file is the configuration file for Astro. It defines how Astro behaves, including build options, integrations, base URLs, and more. Here instead of aws adapter we will use node.js adapter since we are deploying it through container.
    npx astro add node // Adds nodejs adapter.
6. We can then modify sst.config.ts to add vpc, ECS Cluster with a Fargate service in it to deploy our Astro application. 
7. After making these changes, we are good to go.
8. To start in dev mode
        
        npx sst dev // run your AWS application locally while simulating a live AWS environment with hot reloading.
9. To deploy to AWS
        
        npx sst deploy // Fully deploys the app to AWS 
10. Since we are working with containers, we need a Dockerfile to build and run Astro application. During deployment it automatically picks the Dockerfile from the root of the project.
11. Once its deployed successfully, it will generate Loadbalancer URL where you can access your application.
12. If we need any additional AWS services like S3 buckets to be accessed inside the application to store the files, we can create them under sst.config.ts, link them to the service and use them in the code.

## 👀 Want to learn more about SST?

Feel free to check [SST Documentation](https://sst.dev/docs), [Astro on AWS with SST](https://sst.dev/docs/start/aws/astro)