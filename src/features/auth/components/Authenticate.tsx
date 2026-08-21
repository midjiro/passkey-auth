'use client';

import { Button } from '@/shared/components/ui/button';
import { Field, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';

import { register } from '../actions/register';
import { login } from '../actions/login';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { authSchema } from '../validation/auth';
import { AuthFormData } from '../validation/auth';

export const AuthenticateForm = () => {
    const form = useForm({
        defaultValues: {
            email: '',
        },
        resolver: zodResolver(authSchema),
    });

    const registerHandler = (data: AuthFormData) => {
        register(data.email);
    };

    const loginHandler = (data: AuthFormData) => {
        login(data.email)
    };

    return (
        <section className="min-h-dvh flex flex-col justify-center items-center">
            <article className="min-w-2xs md:min-w-1/2 lg:min-w-1/3 xl:min-w-1/4 py-6 px-4 border border-border rounded-lg shadow-zinc-100 shadow-2xl space-y-6">
                <div className="space-y-2">
                    <h1 className="text-lg md:text-xl lg:text-2xl font-bold">
                        Authenticate
                    </h1>

                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        Become a part of our team and gain access to platform
                        features
                    </p>
                </div>

                <form className="space-y-4">
                    <Controller
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <Field>
                                <FieldLabel htmlFor="email">
                                    Email address
                                </FieldLabel>

                                <Input
                                    id="email"
                                    type="email"
                                    {...field}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                />
                            </Field>
                        )}
                    />

                    <p className="text-xs md:text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Button
                            type="button"
                            onClick={form.handleSubmit(loginHandler)}
                            variant="link"
                            className="p-0!"
                            disabled={!form.formState.isValid}
                        >
                            Login
                        </Button>
                    </p>

                    <Button
                        type="button"
                        onClick={form.handleSubmit(registerHandler)}
                        size="lg"
                        disabled={!form.formState.isValid}
                    >
                        Gain Access
                    </Button>
                </form>
            </article>
        </section>
    );
};
