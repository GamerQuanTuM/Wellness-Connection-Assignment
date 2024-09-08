import { PrismaClient } from "@prisma/client";
import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const prisma = new PrismaClient();

/**
 * The function `getUserImageUrls` retrieves image URLs of users from a database and filters out any
 * null values.
 * @returns The `getUserImageUrls` function is returning an array of image URLs for users that have a
 * non-null `imageUrl` property in the database. The function first retrieves all user records from the
 * database using Prisma's `findMany` method, selecting only the `imageUrl` field. It then maps over
 * the user records to extract the `imageUrl` values into a new array and filters out any `
 */
async function getUserImageUrls() {
    const users = await prisma.user.findMany({
      select: {
        imageUrl: true,
      },
    });
  
    // Filtering all images which have a url
    return users
      .map((user: { imageUrl: string | null }) => user.imageUrl)
      .filter((url: string | null): url is string => url !== null);
  }
  
const s3Client = new S3Client({ region: "your-region" });

/**
 * The function `listS3Images` asynchronously lists the keys of objects in a specified S3 bucket.
 * @param {string} bucketName - The `bucketName` parameter is a string that represents the name of the
 * Amazon S3 bucket from which you want to list the images.
 * @returns The function `listS3Images` returns an array of image keys from the specified S3 bucket. If
 * there are no images in the bucket, an empty array is returned.
 */
async function listS3Images(bucketName: string) {
  const command = new ListObjectsV2Command({ Bucket: bucketName });
  const response = await s3Client.send(command);

  // List all images from Amazon S3 Bucket
  return response.Contents?.map((item) => item.Key) || [];
}

/**
 * The function `findUnusedImages` filters out S3 image keys that are not present in the user image
 * URLs.
 * @param {string[]} userImageUrls - UserImageUrls is an array of URLs that represent images uploaded
 * by the user.
 * @param {string[]} s3ImageKeys - S3ImageKeys is an array of strings that represent the keys of images
 * stored in an S3 bucket.
 * @returns The function `findUnusedImages` returns an array of S3 image keys that are not present in
 * the `userImageUrls` array.
 */

//A function to compare the lists and identify unused images:
async function findUnusedImages(
  userImageUrls: string[],
  s3ImageKeys: string[]
) {
  const usedImagesSet = new Set(userImageUrls);
  return s3ImageKeys.filter((key) => !usedImagesSet.has(key));
}

/**
 * The function `deleteUnusedImages` asynchronously deletes unused images from a specified S3 bucket.
 * @param {string} bucketName - The `bucketName` parameter is a string that represents the name of the
 * S3 bucket from which the unused images will be deleted.
 * @param {string[]} unusedImages - An array of strings representing the keys of the unused images that
 * need to be deleted from the specified S3 bucket.
 */
async function deleteUnusedImages(bucketName: string, unusedImages: string[]) {
  const deletePromises = unusedImages.map((key) => {
    const command = new DeleteObjectCommand({ Bucket: bucketName, Key: key });
    return s3Client.send(command);
  });

  await Promise.all(deletePromises);
}

export async function removeUnsedUrlFromS3Bucket() {
  const bucketName = "s3-bucket-name";

  // Step 2: Fetch user image URLs
  const userImageUrls = await getUserImageUrls();

  // Step 3: Fetch S3 image keys
  const s3ImageKeys = await listS3Images(bucketName);

  // Step 4: Find unused images
  const unusedImages = await findUnusedImages(userImageUrls, s3ImageKeys as string[]);

  // Step 5: Delete unused images
  await deleteUnusedImages(bucketName, unusedImages);

  console.log("Unused images deleted successfully");
}
