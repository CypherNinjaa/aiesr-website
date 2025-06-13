"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export default function DatabaseTestPage() {
  const [connectionStatus, setConnectionStatus] = useState<string>("Testing...");
  const [_tables, _setTables] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string>("");

  // Function to create CSS class names for colors
  const getColorClassName = (color: string) => {
    return `category-color-${color.replace("#", "").toLowerCase()}`;
  };

  // Inject CSS rules for dynamic colors
  useEffect(() => {
    if (categories.length > 0) {
      const styleId = "dynamic-category-colors";
      let existingStyle = document.getElementById(styleId);

      if (!existingStyle) {
        existingStyle = document.createElement("style");
        existingStyle.id = styleId;
        document.head.appendChild(existingStyle);
      }

      const cssRules = categories
        .map(category => {
          const className = getColorClassName(category.color);
          return `.${className} { background-color: ${category.color} !important; }`;
        })
        .join("\n");

      existingStyle.textContent = cssRules;
    }
  }, [categories]);

  useEffect(() => {
    testConnection();
  }, []);
  const testConnection = async () => {
    try {
      // Test 1: Basic connection
      const { data: _data, error: connError } = await supabase
        .from("event_categories")
        .select("*")
        .limit(1);

      if (connError) {
        setError(`Connection failed: ${connError.message}`);
        setConnectionStatus("❌ Failed");
        return;
      }

      setConnectionStatus("✅ Connected");

      // Test 2: Check if tables exist (optional, ignore error for demo)
      await supabase.rpc("check_tables_exist");

      // Test 3: Get categories
      const { data: categoriesData, error: catError } = await supabase
        .from("event_categories")
        .select("*");

      if (!catError && categoriesData) {
        setCategories(categoriesData);
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
      setConnectionStatus("❌ Error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">🔍 Database Connection Test</h1>
          {/* Connection Status */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Connection Status</h2>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-lg">{connectionStatus}</p>
              {error && (
                <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}
            </div>
          </div>
          {/* Categories Test */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Event Categories</h2>
            {categories.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {categories.map(category => (
                  <div key={category.id} className="rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{category.icon}</span>{" "}
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>{" "}
                        <div className={styles.categoryColorContainer}>
                          <div
                            className={`${styles.categoryColor} ${getColorClassName(category.color)}`}
                            data-color={category.color}
                            aria-label={`Category color: ${category.color}`}
                            title={`Category color: ${category.color}`}
                          />
                          <span className={styles.categoryColorLabel}>{category.color}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
                <p className="text-yellow-800">
                  No categories found. Make sure you've run the database schema.
                </p>
              </div>
            )}
          </div>
          {/* Setup Instructions */}
          <div className="rounded-md border border-blue-200 bg-blue-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-blue-900">📋 Setup Instructions</h3>
            <div className="space-y-2 text-blue-800">
              <p>
                <strong>1.</strong> Go to your Supabase dashboard
              </p>
              <p>
                <strong>2.</strong> Open SQL Editor
              </p>
              <p>
                <strong>3.</strong> Copy and run the content from <code>database-schema.sql</code>
              </p>
              <p>
                <strong>4.</strong> Create an admin user in Authentication
              </p>
              <p>
                <strong>5.</strong> Add the user to admin_users table
              </p>
            </div>
          </div>
          {/* Environment Check */}
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">Environment Configuration</h2>
            <div className="space-y-2 rounded-lg bg-gray-50 p-4">
              <p>
                <strong>Supabase URL:</strong>
                <span className="ml-2 font-mono text-sm">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Configured" : "❌ Missing"}
                </span>
              </p>
              <p>
                <strong>Supabase Anon Key:</strong>
                <span className="ml-2 font-mono text-sm">
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Configured" : "❌ Missing"}
                </span>
              </p>
              <p>
                <strong>Registration URL:</strong>
                <span className="ml-2 font-mono text-sm">
                  {process.env.NEXT_PUBLIC_REGISTRATION_URL || "Not set"}
                </span>
              </p>
            </div>
          </div>{" "}
          {/* Navigation */}
          <div className="mt-8 flex gap-4">
            <Link
              href="/"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              ← Back to Homepage
            </Link>
            <Link
              href="/admin"
              className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Admin Panel →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
