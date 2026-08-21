import { init } from '@/services/init-auth';
import { verify } from '@/services/verify-auth';
import { startAuthentication } from '@simplewebauthn/browser';
import { toast } from '@/shared/components/ui/toast';

export const login = async (email: string) => {
    const data = await init(email);
    const config = await startAuthentication(data);
    const check = await verify(config);

    if (!check.verified) {
        toast.add({
            title: 'Failed to verify your authentication',
            description: data.error.message,
        });
    } else {
        toast.add({
            title: 'Authentication successful',
            description: 'You are now logged in',
        });
    }
};
