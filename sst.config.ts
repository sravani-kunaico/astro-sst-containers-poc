/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "astro-sst-containers-poc",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const vpc = new sst.aws.Vpc("MyVpc");
    
    const bucket = new sst.aws.Bucket("MyBucket", {
      access: "public"
    });

    const cluster = new sst.aws.Cluster("MyCluster", { vpc });
  
    cluster.addService("MyService", {
      loadBalancer: {
        ports: [{ listen: "80/http", forward: "4321/http" }],
      },
      dev: {
        command: "npm run dev",
      },
      link: [bucket], //We can use this bucket inside our code to store files.
    });
  },
});
