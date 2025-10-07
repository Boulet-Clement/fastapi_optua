"use client";

import { useState, useEffect } from "react";
import Organization from "@/models/Organization";
import DescriptionTab from "@/components/organizations/two_thirds/DescriptionTab";
import MenuTab from "@/components/organizations/two_thirds/MenuTab";
import LocationTab from "@/components/organizations/two_thirds/LocationTab";

interface Props {
  organization: Organization | null;
}

export default function TwoThirds({ organization }: Props) {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Choisir le premier onglet actif par défaut
  useEffect(() => {
    if (!organization) return;

    if (organization.description) {
      setActiveTab("description");
    } else if (organization.menu) {
      setActiveTab("menu");
    } else if (organization.location) {
      setActiveTab("location");
    }
  }, [organization]);

  if (!organization) {
    return (
      <div className="w-full lg:w-2/3 flex justify-center items-center">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  const tabs = [
    organization.description && { key: "description", label: "Description" },
    organization.menu && { key: "menu", label: "Menu" },
    organization.location && { key: "location", label: "Localisation" },
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <div className="w-full lg:w-2/3">
      <div className="mx-auto py-6">
        {/* Onglets */}
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 pb-2 text-gray-600 border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent hover:border-primary-light"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu */}
        <div className="mt-4">
          {activeTab === "description" && (
            <DescriptionTab description={organization.description} />
          )}
          <MenuTab menu={organization.menu} />
          {activeTab === "menu" && <MenuTab menu={organization.menu} />}
          {activeTab === "location" && (
            <LocationTab location={organization.location} />
          )}
        </div>
      </div>
    </div>
  );
}
