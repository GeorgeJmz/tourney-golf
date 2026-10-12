import { Response } from "express";
import admin = require("firebase-admin");
import { getDownloadURL } from "firebase-admin/storage";

export const getRules = async (
  req: { body: { tournamentId: string } },
  res: Response
) => {
  const { tournamentId } = req.body;

  if (!tournamentId || typeof tournamentId !== "string") {
    return res.status(400).json({ error: "Invalid tournamentId" });
  }

  const files = ["rules", "calendar", "calcutta"];
  const bucket = admin.storage().bucket();

  const getFileUrl = async (fileName: string): Promise<string> => {
    const filePath = `pdfs/${tournamentId}/${fileName}.pdf`;

    const file = bucket.file(filePath);
    try {
      const [exists] = await file.exists();

      if (!exists) {
        return "";
      }

      const url = await getDownloadURL(file);
      return url;
    } catch (err) {
      return "";
    }
  };

  try {
    const urls: Record<string, string> = {};
    for (const file of files) {
      urls[file] = await getFileUrl(file);
    }

    return res.status(200).json({ status: "success", data: urls });
  } catch (error) {
    return res.status(500).json({ error: "Error fetching rules URLs" });
  }
};
