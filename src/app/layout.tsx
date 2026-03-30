'use client';

import type { Metadata } from 'next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TeleSpeechProvider } from '@/contexts/TeleSpeechContext';
import { McpCacheProvider } from '@/contexts/McpCacheContext';
import '@/index.css';
import { useState } from 'react';

const agentName = process.env.NEXT_PUBLIC_AGENT_NAME || 'Trainco AI';

// Note: metadata must be exported from a Server Component
// Since we need 'use client' for providers, we'll set title via useEffect
// or move metadata to a separate layout file

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 1000 * 60 * 5,
      },
    },
  }));

  return (
    <html lang="en">
      <head>
        <title>{agentName}</title>
        <meta name="description" content={`Talk to ${agentName} - Career AI Assistant`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <QueryClientProvider client={queryClient}>
          <McpCacheProvider>
            <TeleSpeechProvider>
              {children}
            </TeleSpeechProvider>
          </McpCacheProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
