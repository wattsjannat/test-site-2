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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        
        {/* UIFramework Configuration */}
        <script dangerouslySetInnerHTML={{__html: `
          window.UIFRAMEWORK_AUTO_INIT = true;
          window.UIFrameworkPreInitConfig = {
            explicitTenantUuid: "4e93127e-0dcc-432b-8c27-ed32f064d59e",
            autoConnect: false,
            autoConnectAvatar: false,
            autoConnectVoice: false,
            waitForAvatarBeforeVoice: true,
            voiceUIVisible: false,
            muteByDefault: false,
            enableVoiceChat: true,
            enableAvatar: true,
            lightboard: {
              enabled: false,
            },
          };
        `}} />
        
        {/* UIFramework Site Functions Bridge */}
        <script dangerouslySetInnerHTML={{__html: `
          (function registerUIFrameworkSiteFunctions() {
            const navigationBridge = {
              navigateToSection(data) {
                console.warn("[UIFramework] navigateToSection called before React initialized:", data);
                return false;
              },
            };

            const volumeBridge = {
              setVolume(level) {
                if (typeof level !== "number") return undefined;
                if (typeof window !== "undefined" && window.teleVolume && typeof window.teleVolume.setVolume === "function") {
                  window.teleVolume.setVolume(level);
                  return true;
                }
                return undefined;
              },
            };

            const mcpBridge = {
              fetchJobs() { console.warn("[mcpBridge] fetchJobs called before React initialized"); return undefined; },
              fetchSkills() { console.warn("[mcpBridge] fetchSkills called before React initialized"); return undefined; },
              fetchCandidate() { console.warn("[mcpBridge] fetchCandidate called before React initialized"); return undefined; },
              fetchCareerGrowth() { console.warn("[mcpBridge] fetchCareerGrowth called before React initialized"); return undefined; },
              fetchMarketRelevance() { console.warn("[mcpBridge] fetchMarketRelevance called before React initialized"); return undefined; },
              cacheJobApplicants() { console.warn("[employerApplicantsCache] cacheJobApplicants called before React initialized"); return false; },
            };

            const existingRegistry =
              typeof window !== "undefined" && window.UIFrameworkSiteFunctions && typeof window.UIFrameworkSiteFunctions === "object"
                ? window.UIFrameworkSiteFunctions
                : {};

            window.UIFrameworkSiteFunctions = {
              ...existingRegistry,
              ...navigationBridge,
              ...volumeBridge,
              ...mcpBridge,
            };

            try {
              window.dispatchEvent(new CustomEvent("UIFrameworkSiteFunctionsReady", {
                detail: { registry: window.UIFrameworkSiteFunctions },
              }));
            } catch (e) {}
          })();
        `}} />
        
        {/* Employer Mode - Intercept getUserMedia */}
        <script dangerouslySetInnerHTML={{__html: `
          (function () {
            window.__employerMode = false;
            var _origGUM = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
            navigator.mediaDevices.getUserMedia = function (constraints) {
              if (window.__employerMode && constraints && constraints.audio) {
                try {
                  var ctx = new AudioContext();
                  var dest = ctx.createMediaStreamDestination();
                  return Promise.resolve(dest.stream);
                } catch (e) {
                  return Promise.resolve(new MediaStream());
                }
              }
              return _origGUM(constraints);
            };
          })();
        `}} />
        
        {/* UIFramework LiveAvatar SDK */}
        <script type="module" src="https://telecdn.s3.us-east-2.amazonaws.com/js/ui-framework-liveavatar.js" />
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
