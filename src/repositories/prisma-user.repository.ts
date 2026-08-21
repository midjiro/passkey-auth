import type { PrismaClient } from '@/generated/prisma/client';

import { prisma } from '@/shared/lib/prisma';
import type { UserRepository } from './user.repository';
import type { PasskeyPayload, Passkey, User, UserWithPasskeys } from '@/shared/types/general';
class PrismaUserRepository implements UserRepository {
    constructor(private readonly prisma: PrismaClient) {}

    createUser(email: string, passkey: PasskeyPayload): Promise<User> {
        const payload = {
            credentialId: passkey.credentialId,
            publicKey: Buffer.from(passkey.publicKey),
            counter: passkey.counter,
            deviceType: passkey.deviceType,
            backedUp: passkey.backedUp,
            transports: passkey.transports,
        };

        return this.prisma.user.create({
            data: {
                email,
                passkeys: {
                    create: payload,
                },
            },
        });
    }

    getUserByEmail(email: string): Promise<UserWithPasskeys | null> {
        return this.prisma.user.findUnique({
            where: { email },
            include: { passkeys: true },
        }) as Promise<UserWithPasskeys | null>;
    }

    getPasskeyByCredentialId(credentialId: string): Promise<Passkey | null> {
        return this.prisma.passkey.findUnique({
            where: { credentialId },
        }) as Promise<Passkey | null>;
    }

    async updatePasskeyCounter(
        credentialId: string,
        counter: number,
    ): Promise<void> {
        await this.prisma.passkey.update({
            where: { credentialId },
            data: { counter },
        });
    }
}

export const userRepository: UserRepository = new PrismaUserRepository(prisma);
