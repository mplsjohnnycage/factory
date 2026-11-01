import { intermediaryFromEnv } from "./config.js";
import { createIntermediaryServer } from "./server.js";

export { intermediaryFromEnv } from "./config.js";
export { createIntermediaryServer } from "./server.js";
export { CatalogTranslator } from "./translator.js";
export { HttpPortApiClient } from "./port-client.js";

if (import.meta.url === `file://${process.argv[1]}`) {
  const { host, port, translator } = intermediaryFromEnv();
  const server = createIntermediaryServer(translator);
  server.listen(port, host, () => {
    console.log(`port-catalog-intermediary listening on http://${host}:${port}/catalog`);
  });
}
