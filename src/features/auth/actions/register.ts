import { init } from '@/services/registration/init-registration';
import { verify } from '@/services/registration/verify-registration';
import { startRegistration } from '@simplewebauthn/browser';
import { toast } from '@/shared/components/ui/toast';

export const register = async (email: string) => {
    const data = await init(email);
    const config = await startRegistration(data);
    const check = await verify(config);

    if (!check.verified) {
        toast.add({
            title: 'Failed to verify your account',
            description: data.error.message,
        });
    } else {
        toast.add({
            title: 'Account created successfully',
            description: 'You can now login to your account',
        });
    }
};
