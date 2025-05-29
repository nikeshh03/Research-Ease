import React from 'react';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../utils/supabase';
import { Brain } from 'lucide-react';

export function Auth() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Brain className="h-8 w-8 text-gray-900" />
            <span className="text-2xl font-bold text-gray-900">ResearchEase</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-gray-600">
            Sign in to access AI-powered research paper analysis
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#111827',
                    brandAccent: '#374151',
                  },
                  borderWidths: {
                    buttonBorder: '1px',
                    inputBorder: '1px',
                  },
                  radii: {
                    button: '0.5rem',
                    input: '0.5rem',
                  },
                },
              },
              style: {
                button: {
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                },
                container: {
                  gap: '16px',
                },
                input: {
                  padding: '10px 16px',
                  fontSize: '14px',
                },
                divider: {
                  margin: '24px 0',
                },
                message: {
                  padding: '12px',
                  marginBottom: '16px',
                  fontSize: '14px',
                  borderRadius: '8px',
                },
                anchor: {
                  color: '#111827',
                  fontSize: '14px',
                  textDecoration: 'none',
                },
              },
            }}
            providers={['google']}
            redirectTo={window.location.origin}
            view="sign_in"
            showLinks={true}
          />
        </div>
      </div>
    </div>
  );
}