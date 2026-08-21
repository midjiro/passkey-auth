export type User = {
    id: string;
    email: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export type Passkey = {
    id: string;
    credentialId: string;
    publicKey: Uint8Array;
    counter: number;
    deviceType: 'singleDevice' | 'multiDevice';
    backedUp: boolean;
    transports: string[];
    userId: string;
    createdAt: Date;
    updatedAt: Date;
};

export type UserWithPasskeys = User & {
    passkeys: Passkey[];
};

export type PasskeyPayload = {
    credentialId: string;
    publicKey: Uint8Array;
    counter: number;
    deviceType: 'singleDevice' | 'multiDevice';
    backedUp: boolean;
    transports: string[];
};