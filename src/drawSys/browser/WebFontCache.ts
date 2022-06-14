import { LocalFontProps } from "../AbstractSurface";
import { WebFontProps } from "./WebFontProps";
import { createLocalFontHash } from "../utils/createLocalFontHash";
import { makeWebFontProps } from "./browserUtils/makeWebFontProps";

export class WebFontCache {
  private cache: Record<string, WebFontProps> = {};

  getWebProps(props: LocalFontProps): WebFontProps {
    const hash = createLocalFontHash(props);
    let webProps = this.cache[hash];
    if (webProps) {
      return webProps;
    }
    webProps = makeWebFontProps(props);
    this.cache[hash] = webProps;
    return webProps;
  }
}
