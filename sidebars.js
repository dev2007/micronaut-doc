/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    "intro",
    {
      type: 'category',
      label: 'Micronaut Launch',
      items: [
        'launch/introduction',
        'launch/installation',
        'launch/commands',
        'launch/starterImpls'
      ],
    },
    {
      type: 'category',
      label: 'Micronaut Core',
      items: [
        "core/introduction",
        "core/quickstart",
        "core/ioc",
        "core/config",
        "core/aop",
        {
          type: 'category',
          label: '6. HTTP 服务器',
          link: {type: 'doc',id: "core/httpServer"},
          items: [
            "core/httpserver/runningServer",
            "core/httpserver/runningSpecificPort",
            "core/httpserver/routing",
            "core/httpserver/binding",
            "core/httpserver/customArgumentBinding",
            "core/httpserver/hostResolution",
            "core/httpserver/localeResolution",
            "core/httpserver/clientIpAddress",
            "core/httpserver/requestResponse",
            "core/httpserver/statusAnnotation",
            "core/httpserver/producesAnnotation",
            "core/httpserver/consumesAnnotation",
            "core/httpserver/reactiveServer",
            "core/httpserver/jsonBinding",
            "core/httpserver/datavalidation",
            "core/httpserver/staticResources",
            "core/httpserver/errorHandling",
            "core/httpserver/apiVersioning",
            "core/httpserver/formData",
            "core/httpserver/serverIO",
            "core/httpserver/uploads",
            "core/httpserver/transfers",
            "core/httpserver/filters",
            "core/httpserver/sessions",
            "core/httpserver/sse",
            "core/httpserver/websocket",
            "core/httpserver/http2Server",
            "core/httpserver/serverEvents",
            "core/httpserver/serverConfiguration",
            "core/httpserver/views",
            "core/httpserver/openapi",
            "core/httpserver/graphql",
          ]
        },
        {
          type: 'category',
          label: '7. HTTP 客户端',
          link: {type: 'doc',id: 'core/httpClient'},
          items: [
            'core/httpclient/lowLevelHttpClient',
            'core/httpclient/proxyClient',
            'core/httpclient/clientAnnotation'
          ]
        }
      ]
    },
    {
      type: 'category',
      label: 'Micronaut Cache',
      items: [
        "cache/introduction",
        "cache/releaseHistory",
        "cache/cache-abstraction",
        "cache/jcache",
        "cache/redis",
        "cache/ehcache",
        "cache/hazelcast",
        "cache/infinispan",
        "cache/microstream",
        "cache/repository"
      ]
    },
    {
      type: 'category',
      label: 'Micronaut Redis',
      items: [
        "redis/introduction",
        "redis/releaseHistory",
        "redis/setup",
        "redis/config",
        "redis/testing",
        "redis/cache",
        "redis/sessions",
        "redis/graalvm",
        "redis/repository",
        "redis/appendix"
      ]
    },
    {
      type: 'category',
      label: 'Micronaut MicorStream',
      items: [
        "microstream/introduction",
        "microstream/releaseHistory",
        "microstream/dependency",
        "microstream/configuration",
        "microstream/rootInstance",
        "microstream/annotations",
        "microstream/storage",
        "microstream/cache",
        "microstream/microstreamMetrics",
        "microstream/storageHealth",
        "microstream/rest",
        "microstream/repository"
      ]
    },
    {
      type: 'category',
      label: 'Micronaut Servlet',
      items: [
        "servlet/introduction",
        "servlet/releaseHistory",
        "servlet/servletApi",
        "servlet/warDeployment",
        "servlet/jetty",
        "servlet/tomcat",
        "servlet/undertow",
        "servlet/faq",
        "servlet/breaks",
        "servlet/repository"
      ]
    },
    "graphql/graphql",
    "jmx/jmx",
    "multitenancy/multitenancy",
    "groovy/groovy",
    "acme/acme",
    "aot/aot"
  ],
  actionSidebar: [
    "action/guide",
    {
      type: 'category',
      label: '2. 第一个应用',
      link: { type: 'doc', id: 'action/firstapp' },
      items: [
        "action/application",
        "action/controller",
        "action/service",
        "action/polymorphism"
      ],
    },
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

module.exports = sidebars;
