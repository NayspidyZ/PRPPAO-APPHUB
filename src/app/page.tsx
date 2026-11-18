import React from 'react';
import { fetchAllData } from '@/lib/gas-client';
import { HomeClient } from '@/components/HomeClient';

// Revalidate ISR page every 60 seconds (also invalidated immediately on Admin edits)
export const revalidate = 60;

export default async function HomePage() {
  const { apps, categories, isMock } = await fetchAllData();

  return (
    <HomeClient
      initialApps={apps}
      initialCategories={categories}
      initialIsMock={isMock}
    />
  );
}
