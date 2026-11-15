'use client';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('@/components/Header'), { ssr: false });

export default function TopNavbar(props) {
  return <Header {...props} />;
}
