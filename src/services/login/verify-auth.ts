import { toast } from '@/shared/components/ui/toast';
import type { AuthenticationResponseJSON } from '@simplewebauthn/browser';

export const verify = async (config: AuthenticationResponseJSON) => {
    const res = await fetch(`/api/verify-auth`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(config),
    });

    if (!res.ok) {
        const data = await res.json();

        toast.add({
            title: 'Failed to verify your authentication',
            description: data.error.message,
        });
        return;
    }

    const json = await res.json();

    return json.data;
};
