/// <reference path="./.sst/platform/config.d.ts" />

import "dotenv/config";

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
    const cloudflareIPv4 = [
      "173.245.48.0/20",
      "103.21.244.0/22",
      "103.22.200.0/22",
      "103.31.4.0/22",
      "141.101.64.0/18",
      "108.162.192.0/18",
      "190.93.240.0/20",
      "188.114.96.0/20",
      "197.234.240.0/22",
      "198.41.128.0/17",
      "162.158.0.0/15",
      "104.16.0.0/13",
      "104.24.0.0/14",
      "172.64.0.0/13",
      "131.0.72.0/22",
    ];

    const cloudflareIPv6 = [
      "2400:cb00::/32",
      "2606:4700::/32",
      "2803:f800::/32",
      "2405:b500::/32",
      "2405:8100::/32",
      "2a06:98c0::/29",
      "2c0f:f248::/32",
    ];

    const vpc = new sst.aws.Vpc("AstroSSTTestVpc");

    const cluster = new sst.aws.Cluster("AstroSSTTestCluster", { vpc });

    cluster.addService("AstroSSTContainerServiceTestPOC", {
      loadBalancer: {
        // Listens on port 80 and 443 and forwards to port 4321 (ECS)
        ports: [{ listen: "80/http", forward: "4321/http" }
                ,{ listen: "443/https", forward: "4321/https" }
               ],
        domain: {
          name: "sstpoc.uk",
          dns: sst.cloudflare.dns({
            zone: "03353959adcc4a0e7a670199316debae",
            proxy: true, //Enable Orange Cloud Proxy for Cloudflare so that cloudflare can proxy the traffic to the ALB with cloudflare's IPs
          }),
        },
      },
      transform: { // Restrict ALB to only allow traffic from Cloudflare IP's and not from any public IP
        loadBalancerSecurityGroup: {
          ingress: [
            // Allow HTTP/HTTPS from Cloudflare
            ...cloudflareIPv4.map((cidr) => ({
              fromPort: 80,
              toPort: 80,
              protocol: "tcp",
              cidrBlocks: [cidr],
            })),
            ...cloudflareIPv4.map((cidr) => ({
              fromPort: 443,
              toPort: 443,
              protocol: "tcp",
              cidrBlocks: [cidr],
            })),
            // IPv6 Rules
            ...cloudflareIPv6.map((cidr) => ({
              fromPort: 80,
              toPort: 80,
              protocol: "tcp",
              ipv6CidrBlocks: [cidr],
            })),
            ...cloudflareIPv6.map((cidr) => ({
              fromPort: 443,
              toPort: 443,
              protocol: "tcp",
              ipv6CidrBlocks: [cidr],
            })),
          ],
        },
      },
      dev: {
        command: "npm run dev",
      }
        });
  },
});
