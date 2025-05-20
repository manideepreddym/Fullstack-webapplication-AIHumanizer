/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_UNDETECTABLE_API_KEY: string
  readonly VITE_UNDETECTABLE_USER_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}