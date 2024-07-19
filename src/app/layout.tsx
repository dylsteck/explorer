/* eslint-disable @next/next/no-img-element */

'use client';
import '@neynar/react/dist/style.css';
import './globals.css';
import Link from 'next/link';
import Providers from './providers';
import Search from '@/components/search';
import { useEffect, useState } from 'react';
import { seo } from '@/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DownloadIcon, Grid2X2 } from 'lucide-react';
import { NeynarContextProvider, Theme } from '@neynar/react';
import * as amplitude from '@amplitude/analytics-browser';
import { v4 as uuidv4 } from 'uuid';
import { NeynarAuthButton } from '@neynar/react';
import { usePathname } from 'next/navigation';
import HubsDataComponent from '@/components/hubs-data';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { set } from 'nprogress';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let userId = localStorage.getItem('user_uuid');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('user_uuid', userId);
    }
    amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY as string, userId);
  }, []);

  const getBackgroundImage = () => {
    if (pathname === '/') {
      return 'url(/homebackground.png)';
    }
    return 'url(/searchbackground.png)';
  };

  return (
    <html lang="en">
      <NeynarContextProvider
        settings={{
          clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
          defaultTheme: Theme.Light,
          eventsCallbacks: {
            onAuthSuccess({ user }) {
              setIsAuthenticated(true);
            },
            onSignout(user) {
              setIsAuthenticated(false);
            },
          },
        }}
      >
        <head>
          <meta property="og:title" content={seo.title} />
          <meta property="og:description" content={seo.description} />
          <meta property="og:image" content={seo.ogImage} />
          <meta property="og:url" content={seo.url} />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seo.title} />
          <meta name="twitter:description" content={seo.description} />
          <meta name="twitter:image" content={seo.ogImage} />
        </head>
        <body
          className="relative h-screen min-h-screen"
          style={{
            backgroundImage: getBackgroundImage(),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="flex flex-col min-h-screen">
            <Providers>
              <div className="sticky top-0 z-10 w-full flex justify-between px-0 pl-0">
                <div className="flex items-center space-x-4 h-full">
                  <Link href={'/'}>
                    <img
                      className="w-48"
                      src={'/neynarexplorer.png'}
                      alt="Neynar logo"
                    />
                  </Link>
                </div>
                <div className="flex items-center space-x-1 bg-white py-1 pl-1 pr-0.5">
                  <Link
                    className="font-pixelify text-white text-md bg-gray-700 hover:bg-gray-600  p-1.5 px-3 rounded"
                    href={'/'}
                  >
                    home
                  </Link>
                  <Link
                    target="_blank"
                    className="font-pixelify text-white text-md bg-gray-700 hover:bg-gray-600  p-1.5 px-3 rounded"
                    href={'https://blog.neynar.com/'}
                  >
                    blog
                  </Link>
                  <Link
                    target="_blank"
                    className="font-pixelify text-md text-white bg-gray-700 hover:bg-gray-600  p-1.5 px-3 rounded"
                    href={'https://github.com/neynarxyz/explorer'}
                  >
                    github
                  </Link>
                  <Link
                    target="_blank"
                    className="font-pixelify text-md text-white bg-gray-700 hover:bg-gray-600  p-1.5 px-3 rounded"
                    href={'https://docs.neynar.com/'}
                  >
                    docs
                  </Link>
                  <Dialog>
                    <DialogTrigger className="font-pixelify text-md text-white bg-gray-700 hover:bg-gray-600  p-1.5 px-3 rounded">
                      {!isAuthenticated ? 'sign in' : 'sign out'}
                    </DialogTrigger>
                    <DialogContent className="max-w-sm">
                      <DialogHeader>
                        <DialogTitle>
                          {isAuthenticated ? 'Sign out' : 'Sign in'}
                        </DialogTitle>
                        <DialogDescription className="flex items-center justify-center">
                          <NeynarAuthButton />
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="w-full min-h-screen flex-1">{children}</div>
              <div className="sticky bottom-0 flex items-center justify-between">
                <HubsDataComponent />
                <div className="px-1 p-[0.5px]">
                  <Button className="bg-black" asChild>
                    <Link
                      target="_blank"
                      href="https://warpcast.com/~/add-cast-action?url=https://explorer.neynar.com/frames/actions/view-on-explorer"
                    >
                      <Grid2X2 className="w-4 h-4 mr-2" />
                      Install Cast Action
                    </Link>
                  </Button>
                </div>
              </div>
            </Providers>
          </div>
        </body>
      </NeynarContextProvider>
    </html>
  );
}
