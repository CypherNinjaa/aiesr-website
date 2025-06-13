"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TestConnectionPage() {
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "error">(
    "checking"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [schemaStatus, setSchemaStatus] = useState<"not-checked" | "exists" | "missing">(
    "not-checked"
  );

  useEffect(() => {
    testConnection();
  }, []);
  const testConnection = async () => {
    try {
      // Test basic connection
      const { data: _data, error } = await supabase.from("admin_users").select("count").limit(1);

      if (error) {
        console.error("Connection error:", error);
        setConnectionStatus("error");
        setErrorMessage(error.message);

        // Check if it's a table not found error
        if (error.message.includes('relation "admin_users" does not exist')) {
          setSchemaStatus("missing");
        }
      } else {
        setConnectionStatus("connected");
        setSchemaStatus("exists");
      }
    } catch (err) {
      console.error("Connection test failed:", err);
      setConnectionStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">🔍 Supabase Connection Test</h1>

          {/* Connection Status */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Connection Status</h2>
            <div className="flex items-center space-x-4">
              {connectionStatus === "checking" && (
                <div className="flex items-center text-blue-600">
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-blue-600"></div>
                  Checking connection...
                </div>
              )}

              {connectionStatus === "connected" && (
                <div className="flex items-center text-green-600">
                  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  ✅ Connected to Supabase
                </div>
              )}

              {connectionStatus === "error" && (
                <div className="flex items-center text-red-600">
                  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  ❌ Connection Failed
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
            )}
          </div>

          {/* Schema Status */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Database Schema Status</h2>
            <div className="flex items-center space-x-4">
              {schemaStatus === "not-checked" && (
                <div className="text-gray-600">Not checked yet</div>
              )}

              {schemaStatus === "exists" && (
                <div className="flex items-center text-green-600">
                  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  ✅ Database tables exist
                </div>
              )}

              {schemaStatus === "missing" && (
                <div className="flex items-center text-yellow-600">
                  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  ⚠️ Database schema needs to be created
                </div>
              )}
            </div>
          </div>

          {/* Environment Variables */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Environment Configuration</h2>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Supabase URL:</span>
                <span className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Configured" : "❌ Missing"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Anon Key:</span>
                <span className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Configured" : "❌ Missing"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Registration URL:</span>
                <span className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">
                  {process.env.NEXT_PUBLIC_REGISTRATION_URL ? "✅ Configured" : "❌ Missing"}
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          {schemaStatus === "missing" && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-yellow-800">📋 Next Steps Required</h3>
              <ol className="list-inside list-decimal space-y-2 text-yellow-800">
                <li>
                  Go to your{" "}
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Supabase Dashboard
                  </a>
                </li>
                <li>
                  Navigate to your project:{" "}
                  <code className="rounded bg-yellow-100 px-1">rjbvufpkbyceygiobdus</code>
                </li>
                <li>
                  Click <strong>SQL Editor</strong> in the sidebar
                </li>
                <li>
                  Copy the content from <code>database-schema.sql</code> file
                </li>
                <li>Paste and run the SQL script</li>
                <li>Refresh this page to test again</li>
              </ol>
            </div>
          )}

          {schemaStatus === "exists" && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-green-800">🎉 Ready to Go!</h3>
              <p className="mb-4 text-green-800">
                Your Supabase integration is working! You can now:
              </p>
              <ul className="list-inside list-disc space-y-1 text-green-800">
                {" "}
                <li>
                  Visit the{" "}
                  <Link href="/admin" className="underline">
                    Admin Panel
                  </Link>{" "}
                  to manage events
                </li>
                <li>
                  Check the{" "}
                  <Link href="/" className="underline">
                    Homepage
                  </Link>{" "}
                  to see events
                </li>
                <li>Create your first admin user in Supabase</li>
              </ul>
            </div>
          )}

          {/* Retry Button */}
          <div className="mt-8">
            <button
              onClick={testConnection}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
            >
              🔄 Test Connection Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
