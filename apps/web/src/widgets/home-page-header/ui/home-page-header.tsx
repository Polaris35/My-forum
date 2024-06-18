import { ROUTES } from '@/shared/constants';
import { ThemeButton } from '@/shared/ui';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GiHamburgerMenu } from 'react-icons/gi';
import { GoGear } from 'react-icons/go';
import { IoSearch } from 'react-icons/io5';
import { LuMessageCircle } from 'react-icons/lu';

export function HomePageHeader() {
    const { data: session } = useSession();
    const router = useRouter();
    return (
        <div className="sticky top-0 z-50 flex px-4 py-2 shadow-sm items-center bg-base-100 border-b border-neutral">
            {/* Logo */}
            <Link href="/">
                <div className="flex h-10 items-center flex-shrink-0 cursor-pointer">
                    <Image
                        src="/app-logo.svg"
                        objectFit="contain"
                        height={40}
                        width={40}
                        alt="app-logo"
                    />
                    <p className="text-xl font-bold hidden lg:inline">
                        My-forum
                    </p>
                </div>
            </Link>
            {/* Search box */}
            <form className="input input-ghost flex items-center flex-1 space-x-2 ml-6">
                <IoSearch className="text-grey-500" />
                <input
                    type="text"
                    placeholder="Search Reddit"
                    className="flex-1"
                />
                <button type="submit" hidden />
            </form>
            {/* incons bar */}
            <div className="hidden lg:inline-flex items-center mx-5 gap-1 ">
                <ThemeButton className="w-8 h-8" />
                <button onClick={() => router.push(ROUTES.CHAT)}>
                    <LuMessageCircle className="icon" />
                </button>
                <button onClick={() => router.push(ROUTES.PROFILE)}>
                    <GoGear className="icon" />
                </button>
            </div>
            <div className="ml-5 flex items-center lg:hidden">
                <GiHamburgerMenu className="icon" />
            </div>
            {/* Sign-in/sign-out button */}
            {session ? (
                <button
                    onClick={() => signOut()}
                    className="hidden lg:btn lg:btn-outline btn-primary"
                >
                    <div className="relative h-5 w-5">
                        <Image
                            src="/app-logo.svg"
                            layout="fill"
                            alt="app-logo"
                        />
                    </div>
                    <p>Sign Out</p>
                </button>
            ) : (
                <button
                    onClick={() => signIn()}
                    className="hidden lg:btn lg:btn-outline btn-primary"
                >
                    <div className="relative h-5 w-5">
                        <Image
                            src="/app-logo.svg"
                            layout="fill"
                            alt="app-logo"
                        />
                    </div>
                    <p>Sign In</p>
                </button>
            )}
        </div>
    );
}
