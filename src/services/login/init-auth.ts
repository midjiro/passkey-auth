import { toast } from '@/shared/components/ui/toast';

export const init = async (email: string) => {
    const res = await fetch(`/api/init-auth`, {
        method: 'POST',
        body: JSON.stringify({
            email,
        }),
        credentials: 'include',
    });

    if (!res.ok) {
        const data = await res.json();

        toast.add({
            title: 'Failed to login to your account',
            description: data.error.message,
        });
        return;
    }

    const json = await res.json();

    return json.data;
};
