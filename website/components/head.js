import React from 'react';
import Head from 'next/head';

const twitterHandle = 'samotclub';
const currentURL = 'https://samot.club/';
const favicon = 'https://samot.club//favicon.ico';
const previewImage = 'https://samot.club//preview.png';
const siteName = 'Samot Club';
const pageTitle = 'Samot Club - Where Latin American art, music and culture meet NFTs.';
const description =
  'An NFT Club that introduces the amazing Latin American artistic style. From diverse artists, the first collection comes from the creator himself. Welcome to Samot´s World and enjoy the ride.';

const PageHead = () => (
  <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charSet="utf-8" />

    {/* Twitter */}
    <meta name="twitter:card" content="summary" key="twcard" />
    <meta name="twitter:creator" content={twitterHandle} key="twhandle" />

    {/* Open Graph */}
    <meta property="og:url" content={currentURL} key="ogurl" />
    <meta property="og:image" content={previewImage} key="ogimage" />
    <meta property="og:site_name" content={siteName} key="ogsitename" />
    <meta property="og:title" content={pageTitle} key="ogtitle" />
    <meta property="og:description" content={description} key="ogdesc" />

    {/* SEO */}
    <title>{pageTitle}</title>
    <meta name="description" content={description} />
  </Head>
);

export default PageHead;
