import i18n from "../../languages/i18next";

describe("i18next Testing", () => {
  test("backend,LanguageDetector,languages Testing", () => {
    expect(i18n.modules.backend).not.toEqual(undefined);
    expect(i18n.modules.languageDetector).not.toEqual(undefined);
    expect(i18n.options.whitelist).toEqual(["en", "vi","cimode"]);
  });
});
