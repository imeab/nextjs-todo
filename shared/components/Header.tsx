import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { getCurrentUser } from '@/domains/auth/queries/getCurrentUser.query';
import { use } from 'react';
import SignOutButton from '@/domains/auth/components/SignOutForm';

export default function Header(): React.JSX.Element {
    const user = use(getCurrentUser());
    return (
        <header className="mb-6 flex items-center justify-between rounded-b-xl bg-indigo-100 p-3">
            <Link href="/" className="text-lg font-bold text-indigo-700">
                ✅ My Todo
            </Link>
            <div className="flex items-center gap-2">
                {user ? (
                    <>
                        <span className="text-sm">{user.name}님</span>
                        <SignOutButton />
                    </>
                ) : (
                    <>
                        <Link href="/sign_in">
                            <Button
                                variant="outline"
                                className="cursor-pointer"
                            >
                                <FaSignInAlt /> 로그인
                            </Button>
                        </Link>
                        <Link href="/sign_up">
                            <Button
                                variant="secondary"
                                className="ml-1 cursor-pointer"
                            >
                                <FaUserPlus /> 회원가입
                            </Button>
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}
