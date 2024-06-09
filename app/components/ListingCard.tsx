import { AddToFavorite, DeleteFromFavorite } from "@/app/actions";
import {
  AddToFavoriteButton,
  DeleteFromFavoriteButton,
} from "@/app/components/SubmitButtons";
import { useCountries } from "@/app/lib/getCountries";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  imagePath: string;
  description: string;
  location: string;
  price: number;
  userId: string | undefined;
  isInFavoriteList: boolean;
  favoriteId: string;
  homeId: string;
  pathName: string;
}

export function ListingCard({
  description,
  imagePath,
  location,
  price,
  userId,
  favoriteId,
  isInFavoriteList,
  homeId,
  pathName,
}: iAppProps) {
  const { getCountryByValue } = useCountries();
  const country = getCountryByValue(location);

  return (
    <div className="flex flex-col">
      <div className="relative h-72">
        <Image
          src={`${imagePath}`}
          alt="Image of House"
          fill
          className="rounded-lg h-full object-cover mb-3"
        />
        {userId && (
          <div className="z-10 absolute top-2 right-2">
            {isInFavoriteList ? (
              <form action={DeleteFromFavorite}>
                <input type="hidden" name="favoriteId" value={favoriteId} />
                <input type="hidden" name="userId" value={userId} />
                <input type="hidden" name="pathName" value={pathName} />
                <DeleteFromFavoriteButton />
              </form>
            ) : (
              <form action={AddToFavorite}>
                <input type="hidden" name="homeId" value={homeId} />
                <input type="hidden" name="userId" value={userId} />
                <input type="hidden" name="pathName" value={pathName} />
                <AddToFavoriteButton />
              </form>
            )}
          </div>
        )}
      </div>
      <Link href={`home/${homeId}`} className="mt-2">
        <h3 className="font-medium text-base">
          {country?.flag} {country?.label} / {country?.region}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {description}
        </p>
        <p className="pt-2 text-muted-foreground">
          <span className="font-medium text-black">${price}</span> / Night
        </p>
      </Link>
    </div>
  );
}
