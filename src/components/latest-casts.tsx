/* eslint-disable @next/next/no-img-element */
import useSWR from 'swr';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { CastComponent } from './cast-component';

type Cast = {
  hash: string;
  author: {
    fid: number;
    username: string;
    displayName: string;
    pfp: {
      url: string;
    };
  };
  text: string;
  timestamp: string;
};

const fetcher = async (url: string) => {
  const response = await axios.get(url, {
    headers: {
      'api_key': process.env.NEXT_PUBLIC_NEYNAR_API_KEY,
    },
  });
  return response.data.result.casts;
};

export default function LatestCasts() {
  const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY ?? "";
  const [casts, setCasts] = useState<Cast[]>([]);
  const { data, error } = useSWR(
    `https://api.neynar.com/v1/farcaster/recent-casts?limit=75`,
    fetcher
  );

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const parsedCasts = data.map((item: any) => ({
        hash: item.hash,
        author: {
          fid: item.author.fid,
          username: item.author.username,
          displayName: item.author.displayName,
          pfp: item.author.pfp,
        },
        text: item.text,
        timestamp: item.timestamp,
      }));
      setCasts(parsedCasts);
    }
  }, [data]);

  if (error) return <div>Failed to load casts</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="w-[100%] pb-24 h-screen mt-10">
      <p className="text-xl font-semibold mt-3 mb-2">🚨 Latest Casts</p>
      <div className="w-[100%] flex flex-col gap-3 items-start mx-auto min-w-3xl my-4">
        {casts.length === 0 && <div>Waiting for first cast...</div>}
        {casts.map((cast) => (
          <div key={`cast-${cast.hash}`}>
            <CastComponent cast={cast} />
          </div>
        ))}
      </div>
    </div>
  );
}