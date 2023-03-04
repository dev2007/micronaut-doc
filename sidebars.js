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
        "core/ioc"
      ]
    }
  ],
  actionSidebar: [
    "action/guide",
    {
      type: 'category',
      label: '2. 第一个应用',
      link: {type: 'doc',id: 'action/firstapp'},
      items: [
      ],
    },
  ]

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
