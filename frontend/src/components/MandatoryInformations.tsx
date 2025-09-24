'use client';

import React from 'react';
import Title2 from './ui/Titles/Title2';

interface Block {
  type: 'paragraph' | 'list';
  text?: string;
  items?: string[];
}

interface Section {
  title: string;
  blocks: Block[];
}

interface MandatoryInformationProps {
  sections: Section[];
}

const MandatoryInformation: React.FC<MandatoryInformationProps> = ({ sections }) => {
  return (
    <div className="space-y-10">
      {sections.map((section, idx) => (
        <div key={idx} className="space-y-4">
          <Title2>{section.title}</Title2>

          {section.blocks.map((block, i) => {
            if (block.type === 'paragraph') {
              return (
                <p
                  key={`p-${i}`}
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: block.text ?? '' }}
                />
              );
            }

            if (block.type === 'list') {
              return (
                <ul
                  key={`list-${i}`}
                  className="list-disc list-inside text-gray-700 space-y-1"
                >
                  {block.items?.map((item, j) => (
                    <li key={`li-${j}`} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ul>
              );
            }

            return null;
          })}
        </div>
      ))}
    </div>
  );
};

export default MandatoryInformation;
