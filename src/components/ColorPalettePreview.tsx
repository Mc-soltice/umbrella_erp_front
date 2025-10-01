// import React from 'react';

const colorGroups = ['primary', 'secondary', 'bubble'];
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export default function ColorPalettePreview() {
  return (
    <div className="p-6 space-y-8">
      {colorGroups.map((group) => (
        <div key={group}>
          <h2 className="text-xl font-bold mb-4 capitalize">{group} palette</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-4">
            {shades.map((shade) => (
              <div
                key={`${group}-${shade}`}
                className={`h-20 rounded-lg flex items-center justify-center text-sm font-medium text-white shadow-md bg-${group}-${shade}`}
              >
                {group}-{shade}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
