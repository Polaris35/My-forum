import { ROUTES } from '@/shared/constants';
import { UiButton, UiAvatar, UiTextField } from '@/shared/ui';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export function ProfilePage() {
    const session = useSession();
    const router = useRouter();
    // const handleSubmit = async () => {
    //     await
    //     console.log()
    // }

    return (
        <main className="form-control items-center justify-center min-h-screen bg-base-200">
            <div className="relative card bg-base-100 w-full max-w-[600px] py-10 px-5">
                <span className="text-2xl">Account Settings</span>
                <div className="divider"></div>
                <div className="flex gap-5">
                    <UiAvatar
                        url={session.data?.user?.image as string}
                        size={'large'}
                    />
                    <div className="flex flex-col justify-between gap-y-4">
                        <h3 className="text-lg">Profile photo</h3>
                        <div>
                            <UiButton
                                onClick={() => console.log('edit photo button')}
                                variant={'primary'}
                            >
                                Upload
                            </UiButton>
                        </div>
                    </div>
                </div>
                <div className="divider"></div>
                <div className="form-control gap-3">
                    <div className="flex items-center justify-between">
                        <UiTextField
                            label={'email'}
                            className="w-full"
                            inputProps={{
                                placeholder: session.data?.user.email,
                            }}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <UiTextField
                            label={'username'}
                            className="w-full"
                            inputProps={{
                                placeholder: session.data?.user.name,
                            }}
                        />
                    </div>
                </div>

                <div className="flex gap-x-4 mt-5">
                    <UiButton variant={'primary'}>Save chages</UiButton>
                    <UiButton
                        onClick={() => router.push(ROUTES.HOME)}
                        className="btn-outline hover:underline"
                        variant={'ghost'}
                    >
                        Cancel
                    </UiButton>
                </div>
                {/* <Link
                    href={ROUTES.HOME}
                    className="absolute right-[-70px] top-[-35px] flex flex-col justify-center items-center text-sm"
                >
                    <RxCrossCircled size={30} />
                    <span className="uppercase">esc</span>
                </Link> */}
            </div>
        </main>
    );
}
