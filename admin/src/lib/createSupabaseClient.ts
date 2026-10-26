import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const disabledError = (message: string) => ({
  data: null,
  error: { message, code: "SUPABASE_NOT_CONFIGURED" },
});

/** No network calls when env vars are missing — avoids placeholder.supabase.co failures. */
export function createSupabaseClient(
  url: string | undefined,
  anonKey: string | undefined,
  configHint: string,
): SupabaseClient {
  const configured = Boolean(url?.trim() && anonKey?.trim());
  if (configured) {
    return createClient(url!, anonKey!);
  }

  const err = disabledError(configHint);

  const queryStub: PromiseLike<typeof err> & Record<string, unknown> = {
    select: () => queryStub,
    insert: () => queryStub,
    update: () => queryStub,
    delete: () => queryStub,
    upsert: () => queryStub,
    eq: () => queryStub,
    neq: () => queryStub,
    order: () => queryStub,
    limit: () => queryStub,
    single: () => Promise.resolve(err),
    maybeSingle: () => Promise.resolve(err),
    then: (onFulfilled, onRejected) => Promise.resolve(err).then(onFulfilled, onRejected),
    catch: (onRejected) => Promise.resolve(err).catch(onRejected),
    finally: (onFinally) => Promise.resolve(err).finally(onFinally),
  };

  const authStub = {
    signInWithPassword: async () => err,
    signUp: async () => err,
    signOut: async () => ({ error: null }),
    resetPasswordForEmail: async () => err,
    updateUser: async () => err,
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  };

  const storageBucketStub = {
    upload: async () => err,
    download: async () => err,
    remove: async () => err,
    list: async () => err,
    getPublicUrl: () => ({ data: { publicUrl: "" } }),
  };

  return {
    from: () => queryStub,
    auth: authStub,
    storage: { from: () => storageBucketStub },
  } as unknown as SupabaseClient;
}
