import Link from 'next/link';
import { MouseEventHandler } from 'react';

type Props = {
    label: string;
    href: string;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export const LinkButton = ({ label, href, onClick }: Props) => {
    // Botão de link acessível
    return (
        <Link 
            href={href}
            onClick={onClick}
            aria-label={label}
            className="hover:bg-white hover:text-black px-4 py-2 rounded text-white cursor-pointer transition duration-300 ease-in-out inline-block"
        >
            {label}
        </Link>
    );
}
