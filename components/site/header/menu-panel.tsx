"use client";

import { Fragment } from "react";
import type { MenuDef } from "@/lib/nav";
import { FeatureCard } from "./feature-card";
import { MenuItem } from "./menu-item";

/** The inner content of a desktop dropdown. Layout differs for the wide Product menu and the compact ones. */
export function MenuPanelContent({ menu, onNavigate }: { menu: MenuDef; onNavigate: () => void }) {
  if (menu.layout === "wide") {
    return (
      <div className="flex gap-8 p-6">
        <div className="grid flex-1 grid-cols-2 gap-x-6">
          {menu.columns.map((groups, ci) => (
            <div key={ci} className="flex flex-col gap-7">
              {groups.map((group) => (
                <div key={group.label ?? ci}>
                  {group.label && <GroupLabel>{group.label}</GroupLabel>}
                  <ul className="-mx-2.5 flex flex-col gap-0.5">
                    {group.items.map((item) => (
                      <li key={item.label}>
                        <MenuItem item={item} onNavigate={onNavigate} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div aria-hidden className="w-px self-stretch bg-hairline" />
        <div className="flex w-[260px] shrink-0 flex-col gap-3">
          {menu.cards.map((card) => (
            <FeatureCard key={card.title} card={card} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 p-4">
      <div className="flex flex-1 flex-col gap-6">
        {menu.columns[0].map((group, gi) => (
          <Fragment key={group.label ?? gi}>
            {group.label && <GroupLabel>{group.label}</GroupLabel>}
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <li key={item.label}>
                  <MenuItem item={item} described onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </Fragment>
        ))}
      </div>
      <div className="flex w-[220px] shrink-0 flex-col gap-3">
        {menu.cards.map((card) => (
          <FeatureCard key={card.title} card={card} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-[12.5px] font-medium text-ink-3">{children}</p>;
}
