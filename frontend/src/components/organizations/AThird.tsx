"use client";
import Organization from "@/models/Organization";
import Title1 from "../ui/Titles/Title1";

interface Props {
  organization: Organization
}

export default function AThird({organization}: Props) {
  return (
    <div className="w-full lg:w-1/3">
        <div className="lg:min-h-screen h-full bg-grey-light flex flex-col items-center p-4">
            <Title1>{organization.name}</Title1>
            {/* Opening hours */}
        </div>
    </div>
  );
}
