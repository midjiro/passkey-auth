import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { NextRequest, NextResponse } from 'next/server';

import { userRepository } from '@/repositories/prisma-user.repository';

const { NEXT_PUBLIC_SERVER_URI, RP_ID } = process.env;

if (!NEXT_PUBLIC_SERVER_URI || !RP_ID) {
    throw new Error('NEXT_PUBLIC_SERVER_URI and RP_ID are not set');
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    const challenge = request.cookies.get('challenge');

    if (!challenge)
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

    const verification = await verifyRegistrationResponse({
        response: body,
        expectedChallenge: challenge.value,
        expectedOrigin: NEXT_PUBLIC_SERVER_URI as string,
        expectedRPID: RP_ID as string,
    });

    if (verification.verified) {
        const email = request.cookies.get('email');

        if (!email)
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

        const { credential, credentialDeviceType, credentialBackedUp } =
            verification.registrationInfo;

        await userRepository.createUser(email.value, {
            credentialId: credential.id,
            publicKey: credential.publicKey,
            counter: credential.counter,
            deviceType: credentialDeviceType,
            backedUp: credentialBackedUp,
            transports: credential.transports ?? [],
        });

        const response = NextResponse.json({
            success: true,
            message: 'Passkey registered successfully.',
        });

        const cookiesToClear = ['userId', 'email', 'challenge'];

        cookiesToClear.forEach((key) => response.cookies.delete(key));

        return response;
    } else {
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
}
