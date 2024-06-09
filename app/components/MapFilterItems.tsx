"use client";

import { categoryItems } from "@/app/lib/categoryItems";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function MapFilterItems() {
  const searchParams = useSearchParams();
  const search = searchParams.get("filter");
  const pathname = usePathname();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div>
      {categoryItems ? (
        <div className="flex gap-x-10 mt-5 w-full overflow-x-scroll no-scrollbar">
          {/* <Image
            src="https://a0.muscache.com/pictures/d7445031-62c4-46d0-91c3-4f29f9790f7a.jpg"
            alt="..."
            width={24}
            height={24}
          /> */}
          {categoryItems?.map((item) => (
            <Link
              key={item?.id}
              href={pathname + "?" + createQueryString("filter", item.name)}
              className={cn(
                search === item.name
                  ? "border-b-2 border-black pb-2 flex-shrink-0"
                  : "opacity-70 flex-shrink-0",
                "flex flex-col gap-y-3 items-center"
              )}
            >
              <div className="relative w-6 h-6">
                <Image
                  src={item?.imageUrl}
                  alt="Category image"
                  className="w-6 h-6"
                  width={24}
                  height={24}
                />
              </div>
              <p className="text-xs font-medium">{item?.title}</p>
            </Link>
          ))}
        </div>
      ) : (
        <h1>Hi</h1>
      )}
    </div>
  );
}
