// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Micronaut 实战及文档',
  tagline: 'Micronaut 实战，Micronaut 文档',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://micronaut.bookhub.tech',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'dev2007', // Usually your GitHub org/user name.
  projectName: 'micronaut-doc', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  scripts: [
    {
      src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8380975615223941',
      crossorigin: 'anonymous'
    }
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      docs:{
        sidebar: {
          hideable: true,
        },
      },
      metadata: [{ name: 'keywords', content: 'micronaut,micronaut doc,micronaut 文档' }],
      navbar: {
        title: 'Micronaut 实战及文档',
        logo: {
          alt: 'Micronaut Logo',
          src: 'img/favicon.ico',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: '文档',
          },
          {
            type: 'doc',
            docId: 'action/guide',
            position: 'left',
            label: '实战',
          },
          {
            href: 'https://www.bookhub.tech',
            label: 'BookHub 首页',
            position: 'right',
          },
          {
            href: 'https://docs.bookhub.tech',
            label: '中文文档',
            position: 'right',
          },
          {
            href: 'https://github.com/dev2007/micronaut-doc',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub 仓库',
          },
          {
            type: 'search',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'BookHub',
            items: [
              {
                label: '首页',
                href: 'https://www.bookhub.tech'
              },
              {
                label: '中文文档',
                href: 'https://docs.bookhub.tech',
              },
            ],
          },
          {
            title: '其他文档',
            items: [
              {
                label: 'ElasticSearch',
                href: 'https://elasticsearch.bookhub.tech',
              },
              {
                label: 'MySQL',
                href: 'https://mysql.bookhub.tech',
              },
              {
                label: 'Pac4j',
                href: 'https://pac4j.bookhub.tech',
              }
            ],
          },
          {
            title: '更多',
            items: [
              {
                label: '计算机书库',
                href: 'https://pdf.bookhub.tech',
              }
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} bookHub.tech`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['bash', 'java', 'yaml', 'json', 'groovy', 'kotlin']
      },
    }),
};

module.exports = config;
