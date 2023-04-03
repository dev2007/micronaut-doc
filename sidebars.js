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
        "core/aop"
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
    "jmx/jmx",
    "aot/aot"
  ],
  actionSidebar: [
    "action/guide",
    {
      type: 'category',
      label: '2. 第一个应用',
      link: {type: 'doc',id: 'action/firstapp'},
      items: [
        "action/application",
        "action/controller"
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
