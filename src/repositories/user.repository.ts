import type { PasskeyPayload, Passkey, User, UserWithPasskeys } from '@/shared/types/general';
export interface UserRepository {
    createUser(email: string, passkey: PasskeyPayload): Promise<User>;
    getUserByEmail(email: string): Promise<UserWithPasskeys | null>;
    getPasskeyByCredentialId(credentialId: string): Promise<Passkey | null>;
    updatePasskeyCounter(credentialId: string, counter: number): Promise<void>;
}
