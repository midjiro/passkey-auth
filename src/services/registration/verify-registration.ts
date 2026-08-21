import { toast } from '@/shared/components/ui/toast';
import type { RegistrationResponseJSON } from '@simplewebauthn/browser';

export const verify = async (config: RegistrationResponseJSON) => {
    const res = await fetch(`/api/verify-registration`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(config),
    });

    if (!res.ok) {
        const data = await res.json();

        toast.add({
            title: 'Failed to verify your account',
            description: data.error.message,
        });
        return;
    }

    const json = await res.json();

    return json.data;
};
