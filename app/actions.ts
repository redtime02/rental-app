"use server";

import prisma from "@/app/lib/db";
import { supabase } from "@/app/lib/supabase";
import { redirect } from "next/navigation";
import cloudinary from "cloudinary";
import { revalidatePath } from "next/cache";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export async function createAirbnbHome({ userId }: { userId: string }) {
  const data = await prisma.home.findFirst({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (data == null) {
    const data = await prisma.home.create({
      data: {
        userId: userId,
      },
    });
    return redirect(`/create/${data.id}/structure`);
  } else if (
    !data.addedCategory &&
    !data.addedDescription &&
    !data.addedLocation
  ) {
    return redirect(`/create/${data.id}/structure`);
  } else if (data.addedCategory && !data.addedDescription) {
    return redirect(`/create/${data.id}/description`);
  } else if (
    data.addedCategory &&
    data.addedDescription &&
    !data.addedLocation
  ) {
    return redirect(`/create/${data.id}/address`);
  } else if (
    data.addedCategory &&
    data.addedDescription &&
    data.addedLocation
  ) {
    const data = await prisma.home.create({
      data: {
        userId: userId,
      },
    });
    return redirect(`/create/${data.id}/structure`);
  }
}

export async function createCategoryPage(formData: FormData) {
  const categoryName = formData.get("categoryName") as string;
  const homeId = formData.get("homeId") as string;
  const data = await prisma.home.update({
    where: {
      id: homeId,
    },
    data: {
      categoryName: categoryName,
      addedCategory: true,
    },
  });
  return redirect(`/create/${homeId}/description`);
}

export async function createDescription(formData: FormData) {
  let redirectPath: string | null = null;
  try {
    // Extract values from formData
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price");
    const imageFile = formData.get("image") as File;
    const homeId = formData.get("homeId") as string;
    const guestNumber = formData.get("guest") as string;
    const roomNumber = formData.get("room") as string;
    const bathroomNumber = formData.get("bathroom") as string;

    // // Validate required fields
    // if (!title || !description || !price || !imageFile || !homeId) {
    //   throw new Error("Missing required fields");
    // }

    // // Validate numeric fields
    // if (isNaN(Number(price)) || isNaN(Number(guestNumber)) || isNaN(Number(roomNumber)) || isNaN(Number(bathroomNumber))) {
    //   throw new Error("Invalid numeric values");
    // }

    // Upload image to Supabase
    // const { data: imageData, error: uploadError } = await supabase.storage
    //   .from("images")
    //   .upload(`${imageFile.name}-${new Date().toISOString()}`, imageFile, {
    //     cacheControl: "2592000",
    //     contentType: "image/webp",
    //   }

    // Upload the image to Cloudinary
    const imageUploadResponse = await new Promise<string>((resolve, reject) => {
      cloudinary.v2.uploader.upload(
        `C:\Users\\HP\\Downloads\\${imageFile.name}`,
        {
          upload_preset: "ml_default",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );
    });

    // Update the database with new description details
    const data = await prisma.home.update({
      where: {
        id: homeId,
      },
      data: {
        title: title,
        description: description,
        price: Number(price),
        bedrooms: roomNumber,
        bathrooms: bathroomNumber,
        guests: guestNumber,
        photo: imageUploadResponse,
        addedDescription: true,
      },
    });

    // Log form data for debugging purposes
    console.log({
      title,
      description,
      price,
      imageUploadResponse,
      homeId,
      guestNumber,
      roomNumber,
      bathroomNumber,
    });

    redirectPath = `/create/${homeId}/address`;
  } catch (error) {
    console.log(error);
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }
}

export async function createLocation(formData: FormData) {
  const homeId = formData.get("homeId") as string;
  const countryValue = formData.get("countryValue") as string;
  const data = await prisma.home.update({
    where: {
      id: homeId,
    },
    data: {
      addedLocation: true,
      country: countryValue,
    },
  });
  4;

  return redirect("/");
}

export async function AddToFavorite(formData: FormData) {
  const homeId = formData.get("homeId") as string;
  const userId = formData.get("userId") as string;
  const pathName = formData.get("pathName") as string;

  const data = await prisma.favorite.create({
    data: {
      homeId: homeId,
      userId: userId,
    },
  });

  revalidatePath(pathName);
}

export async function DeleteFromFavorite(formData: FormData) {
  const favoriteId = formData.get("favoriteId") as string;
  const pathName = formData.get("pathName") as string;
  const userId = formData.get("userId") as string;

  const data = await prisma.favorite.delete({
    where: {
      id: favoriteId,
      userId: userId,
    },
  });

  revalidatePath(pathName);
}

export async function createReservation(formData: FormData) {
  const userId = formData.get("userId") as string;
  const homeId = formData.get("homeId") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;

  const data = await prisma.reservation.create({
    data: {
      userId: userId,
      endDate: endDate,
      startDate: startDate,
      homeId: homeId,
    },
  });

  return redirect("/");
}
