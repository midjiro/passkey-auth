import {
    generateAuthenticationOptions,
    type AuthenticatorTransportFuture,
} from '@simplewebauthn/server';
import { NextResponse } from 'next/server';

import { userRepository } from '@/repositories/prisma-user.repository';

const { RP_ID } = process.env;

if (!RP_ID) {
    throw new Error('RP_ID is not set');
}

export async function POST(request: Request) {
    const body = await request.json();

    if (!body || !body.email)
        return Response.json(
            {
                error: {
                    code: 'MISSING_CREDENTIALS',
                    message: 'Email address is required.',
                },
            },
            {
                status: 400,
            },
        );

    const user = await userRepository.getUserByEmail(body.email);

    if (!user)
        return Response.json(
            {
                error: {
                    code: 'NOT_FOUND',
                    message: 'Failed to login.',
                },
            },
            {
                status: 404,
            },
        );

    const options = await generateAuthenticationOptions({
        rpID: RP_ID as string,
        allowCredentials: user.passkeys.map((passkey) => ({
            id: passkey.credentialId,
            transports: passkey.transports as AuthenticatorTransportFuture[],
        })),
    });

    const response = NextResponse.json({
        data: options,
    });

    response.cookies.set('userId', user.id);
    response.cookies.set('email', user.email ?? body.email);
    response.cookies.set('challenge', options.challenge);

    return response;
}
