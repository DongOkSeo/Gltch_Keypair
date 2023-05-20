module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "kr"],
    localeDetection: false,
  },
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
