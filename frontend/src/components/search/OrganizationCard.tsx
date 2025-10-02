import React from "react";
import Organization from "@/models/Organization";

interface OrganizationCardProps {
  organization: Organization;
}

export default function OrganizationCard({ organization }: OrganizationCardProps){
  return (
    <a href={organization.slug} target="_blank" className="block">
      <div className="flex flex-col sm:flex-row items-start bg-white p-4 rounded shadow gap-4 hover:shadow-lg transition">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{organization.name}</h3>
          <p className="text-gray-700 truncate">{organization.chapo}</p>
          {organization.keywords_details && organization.keywords_details.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {organization.keywords_details.map((k) => (
                <span
                  key={k.code}
                  className="text-xs bg-blue-100 text-primary-dark px-2 py-0.5 rounded-full"
                >
                  {k.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
