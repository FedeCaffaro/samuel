/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';

function LinkButton({ className, href, key, children }) {
  return (
    <Link href={href} key={key}>
      <a className={className}>{children}</a>
    </Link>
  );
}

export default LinkButton;
