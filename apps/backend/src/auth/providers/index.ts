import { CredentialsProvider } from './credentials.provider';
import { GoogleProvider } from './google.provider';
export * from './provider.factory';

export const PROVIDERS = [GoogleProvider, CredentialsProvider];
