import React, { useState, useEffect } from 'react';
import { CountryCode, RoadProject } from './types';
import { COUNTRIES, SEED_PROJECTS } from './data/roadsData';
import { Header } from './components/Header';
import { StepIndicator } from './components/StepIndicator';
import { RoadSelector } from './components/RoadSelector';
import { RoadProfileCard } from './components/RoadProfileCard';
import { BudgetBenchmark } from './components/BudgetBenchmark';
import { CitizenVerification } from './components/CitizenVerification';
import { StructuralContextCard } from './components/StructuralContextCard';
import { FutureProjectsRoadmap } from './components/FutureProjectsRoadmap';
import { Footer } from './components/Footer';

export default function App() {
  const [countryCode, setCountryCode] = useState<CountryCode>('KE');
  const [selectedProject, setSelectedProject] = useState<RoadProject>(() => {
    return SEED_PROJECTS.find((p) => p.countryCode === 'KE') || SEED_PROJECTS[0];
  });

  // When country switches, update default project to the first project in that country
  const handleCountryChange = (newCountry: CountryCode) => {
    setCountryCode(newCountry);
    const countryFirstProject = SEED_PROJECTS.find((p) => p.countryCode === newCountry);
    if (countryFirstProject) {
      setSelectedProject(countryFirstProject);
    }
  };

  const handleSelectProject = (project: RoadProject) => {
    setSelectedProject(project);
    // If selecting a project from another country, sync countryCode
    if (project.countryCode !== countryCode) {
      setCountryCode(project.countryCode);
    }
  };

  const currentCountryInfo = COUNTRIES[countryCode];

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#1E2522] flex flex-col font-sans selection:bg-[#E09F3E]/30 selection:text-[#1E2522]">
      {/* Gazette Header with Step 01 Country Switcher */}
      <Header
        currentCountry={countryCode}
        onSelectCountry={handleCountryChange}
        activeRoadName={selectedProject?.name}
        activeRoadClass={selectedProject?.roadClass}
      />

      {/* Sequential 5-Step Process Tracker */}
      <StepIndicator currentStep={5} />

      {/* Main Content Flow Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8">
        {/* Step 02: Road Identification & Selection / Custom Classifier */}
        <RoadSelector
          countryCode={countryCode}
          selectedProject={selectedProject}
          onSelectProject={handleSelectProject}
        />

        {/* Step 03: Responsible Authority, Mandate & Funding Details */}
        <RoadProfileCard
          project={selectedProject}
          country={currentCountryInfo}
        />

        {/* Step 04: Unit Cost per km & Universal Benchmark Comparison */}
        <BudgetBenchmark
          project={selectedProject}
          country={currentCountryInfo}
          onSelectProject={handleSelectProject}
        />

        {/* Step 05: Ground Truth Citizen Verification & Ombudsman Petition Draft */}
        <CitizenVerification
          project={selectedProject}
          country={currentCountryInfo}
        />

        {/* Comparative Institutional Governance Matrix (Kenya KRB vs Uganda MoWT vs Nigeria LGA) */}
        <StructuralContextCard
          currentCountry={countryCode}
          onSelectCountry={handleCountryChange}
        />

        {/* Civic Ledger Expansion Plan: Roads to Universal Public Projects */}
        <FutureProjectsRoadmap
          currentCountry={countryCode}
        />
      </main>

      {/* Gazette Footer with Full Provenance Notice */}
      <Footer />
    </div>
  );
}
