/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVICE_ID: string;
  readonly VITE_USER_ID: string;
  readonly VITE_TEMPLATE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
