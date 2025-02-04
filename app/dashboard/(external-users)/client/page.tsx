'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { NangoConnect } from '@/components/nango-connect'
import { useSession } from '@/lib/hooks/use-session'
import { useToast } from "@/components/ui/use-toast"

type Integration = {
  integration_type: string
  integration_id: string
  enabled: boolean
}

const INTEGRATION_DETAILS: Record<string, { icon: JSX.Element; description: string }> = {
  'google-drive': {
    icon: (
      <svg viewBox="0 0 87.3 78" className="w-10 h-10">
        <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
        <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
        <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
        <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
        <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
        <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
      </svg>
    ),
    description: 'Connect your Google Drive account to manage files and folders.'
  },
  'airtable': {
    icon: (
      <svg viewBox="0 -20.5 256 256" className="w-10 h-10">
        <g>
          <path d="M114.25873,2.70101695 L18.8604023,42.1756384 C13.5552723,44.3711638 13.6102328,51.9065311 18.9486282,54.0225085 L114.746142,92.0117514 C123.163769,95.3498757 132.537419,95.3498757 140.9536,92.0117514 L236.75256,54.0225085 C242.08951,51.9065311 242.145916,44.3711638 236.83934,42.1756384 L141.442459,2.70101695 C132.738459,-0.900338983 122.961284,-0.900338983 114.25873,2.70101695" fill="#FFBF00" />
          <path d="M136.349071,112.756863 L136.349071,207.659101 C136.349071,212.173089 140.900664,215.263892 145.096461,213.600615 L251.844122,172.166219 C254.281184,171.200072 255.879376,168.845451 255.879376,166.224705 L255.879376,71.3224678 C255.879376,66.8084791 251.327783,63.7176768 247.131986,65.3809537 L140.384325,106.815349 C137.94871,107.781496 136.349071,110.136118 136.349071,112.756863" fill="#26B5F8" />
          <path d="M111.422771,117.65355 L79.742409,132.949912 L76.5257763,134.504714 L9.65047684,166.548104 C5.4112904,168.593211 0.000578531073,165.503855 0.000578531073,160.794612 L0.000578531073,71.7210757 C0.000578531073,70.0173017 0.874160452,68.5463864 2.04568588,67.4384994 C2.53454463,66.9481944 3.08848814,66.5446689 3.66412655,66.2250305 C5.26231864,65.2661153 7.54173107,65.0101153 9.47981017,65.7766689 L110.890522,105.957098 C116.045234,108.002206 116.450206,115.225166 111.422771,117.65355" fill="#ED3049" />
          <path d="M111.422771,117.65355 L79.742409,132.949912 L2.04568588,67.4384994 C2.53454463,66.9481944 3.08848814,66.5446689 3.66412655,66.2250305 C5.26231864,65.2661153 7.54173107,65.0101153 9.47981017,65.7766689 L110.890522,105.957098 C116.045234,108.002206 116.450206,115.225166 111.422771,117.65355" fillOpacity="0.25" fill="#000000" />
        </g>
      </svg>
    ),
    description: 'Integrate with Airtable to sync and manage your data.'
  },
  'quickbooks': {
    icon: (
      <svg viewBox="0 0 128 128" className="w-10 h-10">
        <path d="M64 128c35.346 0 64-28.654 64-64S99.346 0 64 0 0 28.654 0 64s28.654 64 64 64z" fill="#2ca01c"/>
        <path d="M17.778 64a24.889 24.889 0 0 0 24.889 24.889h3.555v-9.245h-3.555a15.645 15.645 0 1 1 0-31.289H51.2v48.356a9.248 9.248 0 0 0 9.244 9.245V39.111H42.667A24.889 24.889 0 0 0 17.777 64zm67.555-24.889h-3.555v9.245h3.555a15.645 15.645 0 0 1 0 31.288H76.8V31.29a9.244 9.244 0 0 0-9.244-9.245V88.89h17.777a24.888 24.888 0 0 0 0-49.778z" fill="#fff"/>
      </svg>
    ),
    description: 'Connect to QuickBooks for financial management and accounting.'
  },
  'slack': {
    icon: (
      <svg viewBox="0 0 128 128" className="w-10 h-10">
        <path d="M27.2 80c0 7.3-5.9 13.2-13.2 13.2C6.7 93.2.8 87.3.8 80c0-7.3 5.9-13.2 13.2-13.2h13.2V80zm6.6 0c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2v33c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V80z" fill="#E01E5A"/>
        <path d="M47 27.2c-7.3 0-13.2-5.9-13.2-13.2C33.8 6.7 39.7.8 47 .8c7.3 0 13.2 5.9 13.2 13.2v13.2H47zm0 6.6c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H13.9C6.6 60.2.7 54.3.7 47c0-7.3 5.9-13.2 13.2-13.2H47z" fill="#36C5F0"/>
        <path d="M99.8 47c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H99.8V47zm-6.6 0c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V13.9C66.8 6.6 72.7.7 80 .7c7.3 0 13.2 5.9 13.2 13.2V47z" fill="#2EB67D"/>
        <path d="M80 99.8c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V99.8H80zm0-6.6c-7.3 0-13.2-5.9-13.2-13.2 0-7.3 5.9-13.2 13.2-13.2h33.1c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H80z" fill="#ECB22E"/>
      </svg>
    ),
    description: 'Connect your Slack workspace to enable messaging and notifications.'
  },
  'youtube': {
    icon: (
      <svg viewBox="0 0 159 110" className="w-10 h-10">
        <path d="M154.4 17.5c-1.8-6.7-7.1-12-13.9-13.8C128.2.4 79.1.4 79.1.4S30 .5 17.7 3.7C10.9 5.5 5.6 10.8 3.8 17.5 .6 29.7.6 55.3.6 55.3s0 25.6 3.2 37.8C5.6 99.8 10.9 105.1 17.7 106.9c12.3 3.3 61.4 3.3 61.4 3.3s49.1 0 61.4-3.3c6.8-1.8 12.1-7.1 13.9-13.8 3.2-12.2 3.2-37.8 3.2-37.8s0-25.6-3.2-37.8" fill="#FF0000"/>
        <path d="M63.9 79.2V31.4L103.2 55.3 63.9 79.2z" fill="#FFFFFF"/>
      </svg>
    ),
    description: 'Connect your YouTube account to manage your videos and channel analytics.'
  },
  'stripe': {
    icon: (
      <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
      </svg>
    ),
    description: 'Connect your Stripe account to manage payments and transactions.'
  },
  'notion': {
    icon: (
      <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
      </svg>
    ),
    description: 'Connect your Notion workspace to sync and manage your documents.'
  }
}

export default function ClientDashboard() {
  const { session, user, loading } = useSession();
  const { toast } = useToast();
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([]);

  useEffect(() => {
    const loadConnectedIntegrations = async () => {
      try {
        // TODO: Implement backend API for connected integrations
        // Temporarily disabled for demo
        /*
        const response = await fetch('/api/integrations/connected');
        if (!response.ok) {
          throw new Error('Failed to fetch connected integrations');
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setConnectedIntegrations(data.integrations || []);
        */
        
        // For demo: simulate no connected integrations
        setConnectedIntegrations([]);
      } catch (error) {
        console.error('Failed to load connected integrations:', error);
        // Temporarily disabled error toast for demo
        /*
        toast({
          title: "Error",
          description: "Failed to load your connected integrations. Please refresh the page.",
          variant: "destructive",
        });
        */
      }
    };

    if (session?.token && user?.id) {
      loadConnectedIntegrations();
    }
  }, [session?.token, user?.id, toast]);

  const handleSuccess = (integrationType: string) => {
    setConnectedIntegrations(prev => [...prev, integrationType]);
    toast({
      title: "Integration Connected",
      description: `Successfully connected to ${integrationType.split('-').join(' ')}.`,
    });
  };

  const handleError = (integrationType: string, error: Error) => {
    toast({
      title: "Connection Failed",
      description: `Failed to connect to ${integrationType.split('-').join(' ')}. Please try again.`,
      variant: "destructive",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded"></div>
                  <div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded mt-2"></div>
                  </div>
                </div>
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-9 w-full bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session || !user) {
    return null;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Available Integrations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(INTEGRATION_DETAILS).map(([integrationType, details]) => (
          <Card key={integrationType} className="bg-white">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-shrink-0">
                  {details.icon}
                </div>
                <div>
                  <h3 className="font-bold capitalize">
                    {integrationType.split('-').join(' ')}
                  </h3>
                  <span className="text-sm text-green-600">Available</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 flex-grow">{details.description}</p>
              <div className="mt-auto">
                <NangoConnect
                  integrationType={integrationType as any}
                  sessionToken={session.token}
                  userId={user.id}
                  onSuccess={() => handleSuccess(integrationType)}
                  onError={(error) => handleError(integrationType, error)}
                  isConnected={connectedIntegrations.includes(integrationType)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
