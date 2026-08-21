import {
    verifyAuthenticationResponse,
    type AuthenticatorTransportFuture,
} from '@simplewebauthn/server';
import { NextRequest, NextResponse } from 'next/server';

import { userRepository } from '@/repositories/prisma-user.repository';

const { NEXT_PUBLIC_SERVER_URI, RP_ID } = process.env;

if (!NEXT_PUBLIC_SERVER_URI || !RP_ID) {
    throw new Error('NEXT_PUBLIC_SERVER_URI and RP_ID are not set');
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    const challenge = request.cookies.get('challenge');
    const email = request.cookies.get('email');

    if (!challenge || !email)
        return Response.json(
            {
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Unauthorized.',
                },
            },
            {
                status: 401,
            },
        );

    const passkey = await userRepository.getPasskeyByCredentialId(body.id);

    if (!passkey)
        return Response.json(
            {
                error: {
                    code: 'NOT_FOUND',
                    message: 'Passkey not found.',
                },
            },
            {
                status: 404,
            },
        );

    const verification = await verifyAuthenticationResponse({
        response: body,
        expectedChallenge: challenge.value,
        expectedOrigin: NEXT_PUBLIC_SERVER_URI as string,
        expectedRPID: RP_ID as string,
        credential: {
            id: passkey.credentialId,
            publicKey: new Uint8Array(passkey.publicKey),
            counter: passkey.counter,
            transports: passkey.transports as AuthenticatorTransportFuture[],
        },
    });

    if (verification.verified) {
        await userRepository.updatePasskeyCounter(
            passkey.credentialId,
            verification.authenticationInfo.newCounter,
        );

        const response = NextResponse.json({
            data: { verified: true },
        });

        const cookiesToClear = ['userId', 'email', 'challenge'];

        cookiesToClear.forEach((key) => response.cookies.delete(key));

        return response;
    }

    return Response.json(
        {
            error: {
                code: 'UNAUTHORIZED',
                message: 'Unauthorized.',
            },
        },
        {
            status: 401,
        },
    );
}
