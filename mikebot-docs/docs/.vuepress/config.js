const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'MikeBot\'s Docs!',
  theme: 'yuu',

  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', {name: 'theme-color', content: '#3eaf7c'}],
    ['meta', {name: 'apple-mobile-web-app-capable', content: 'yes'}],
    ['meta', {name: 'apple-mobile-web-app-status-bar-style', content: 'black'}]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    logo: 'https://cdn.discordapp.com/avatars/698459684205494353/034117db6185d61972fd8600fefcbb17.png?size=1024',
    repo: 'mah51/mikebot-docs',
    editLinks: false,
    yuu: {
      defaultDarkTheme: true,
      defaultColorTheme: 'green',
    },
    docsDir: '',
    editLinkText: '',
    search: false,
    smoothScroll: true,
    lastUpdated: true,
    nav: [
      {
        text: 'Commands',
        link: '/commands/'
      },
      {
        text: 'Invite the bot',
        link: 'https://discord.com/oauth2/authorize?client_id=698459684205494353&permissions=1576528982&scope=bot'
      },
      {
        text: 'Website',
        link: 'https://mikebot.xyz'
      }
    ],
    sidebar: [
      {
        title: 'Commands',   // required
        path: '/commands/',      // optional, link of the title, which should be an absolute path and must exist
        collapsable: false, // optional, defaults to true
        sidebarDepth: 0,    // optional, defaults to 1
        children: [
          '/commands/currency',
          '/commands/fun',
          '/commands/gamer-btw',
          '/commands/info',
          '/commands/join-sound',
          '/commands/lookups',
          '/commands/moderation',
          '/commands/music',
          '/commands/patterns',
          '/commands/reddit',
          '/commands/server-tools',
          '/commands/text',
          '/commands/util'
        ]
      }
    ]
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
