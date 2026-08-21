import { generateRegistrationOptions } from '@simplewebauthn/server';
import { NextResponse } from 'next/server';

import { userRepository } from '@/repositories/prisma-user.repository';

const { RP_ID, RP_NAME } = process.env;

if (!RP_ID || !RP_NAME) {
    throw new Error('RP_ID and RP_NAME are not set');
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

    const exists = await userRepository.getUserByEmail(body.email);

    if (exists)
        return Response.json(
            {
                error: {
                    code: 'ALREADY_EXISTS',
                    message: 'User with given email already exists.',
                },
            },
            {
                status: 400,
            },
        );

    const options = await generateRegistrationOptions({
        rpID: RP_ID as string,
        rpName: RP_NAME as string,
        userName: body.email,
    });
    const response = NextResponse.json({
        data: options,
    });

    response.cookies.set('userId', options.user.id);
    response.cookies.set('email', options.user.name);
    response.cookies.set('challenge', options.challenge);

    return response;
}
