/** Port classic webhook headers (docs.port.io signature-verification). */
export type PortWebhookHeaders = {
  signature: string;
  timestamp: string;
};

/** Inbound Port webhook invocation (shape is Port-owned; we treat body as opaque JSON). */
export type PortWebhookBody = Record<string, unknown>;

export type WriterKey = `${string}:${string}`;

export type CatalogEntity = {
  blueprint: string;
  entityIdentifier: string;
  catalogVersion: number;
  properties: Record<string, unknown>;
};

export type CatalogWriteRequest = {
  blueprint: string;
  entityIdentifier: string;
  /** Optimistic concurrency token — must equal stored catalogVersion (0 if create). */
  expectedCatalogVersion: number;
  /** Properties to merge on successful apply (lease/claim fields included). */
  patch: Record<string, unknown>;
};

export type CatalogWriteOk = {
  ok: true;
  entity: CatalogEntity;
};

export type CatalogWriteStale = {
  ok: false;
  reason: "stale_catalog_version";
  currentVersion: number;
  expectedCatalogVersion: number;
};

export type CatalogWriteResult = CatalogWriteOk | CatalogWriteStale;

export type SupervisorAdmit = {
  id: string;
  receivedAt: string;
  actionIdentifier?: string;
  runId?: string;
  payload: PortWebhookBody;
};

export type CatalogStore = {
  get(blueprint: string, entityIdentifier: string): Promise<CatalogEntity | null>;
  put(entity: CatalogEntity): Promise<void>;
};
