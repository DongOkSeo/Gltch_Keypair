import { Intro } from "@pages";
import { UserConfig } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default Intro;
export const getStaticProps = async ({
  locale,
}: {
  locale: string;
}): Promise<{
  props: {
    _nextI18Next: {
      initialI18nStore: any;
      initialLocale: string;
      ns: string[];
      userConfig: UserConfig | null;
    };
  };
}> => ({
  props: {
    ...(await serverSideTranslations(locale, ["home", "common"])),
  },
});
