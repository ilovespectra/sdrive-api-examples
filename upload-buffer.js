import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import dotenv from "dotenv";
import mime from "mime-types";
import path from "path";
dotenv.config();
async function uploadFile(fileStream, filename) {
  let formData = new FormData();
  let username = process.env.username;
  let apikey = process.env.apikey;
  let base_url = process.env.base_url || "https://sdrive.app/api/v3";
  let mimetype = mime.lookup(path.extname(filename));
  formData.append("fileupload", fileStream, {
    filename: filename,
    contentType: mimetype,
  });
  formData.append("username", username);
  formData.append("apikey", apikey);
  //optional, set this to "true" if you want the files to be uploaded to your personal account instead of an immutable storage account
  //formData.append("use_personal", "true");

  return await axios
    .post(base_url + "/upload", formData, {
      headers: formData.getHeaders(), // Set headers from formData
    })
    .catch((error) => {
      if (error.response) {
        const errorInfo = {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        };
        throw Error(JSON.stringify(errorInfo));
      } else {
        // handle errors that don't have a response (e.g., network issues)
        throw error;
      }
    })

    .then((response) => {
      return response.data;
    });
}

// Example usage
(async () => {
  const filename = "data.json";
  const filedata = { data: "Hello world" };

  const jsonString = JSON.stringify(filedata); // Convert JSON object to a string
  const blob = Buffer.from(jsonString); // Convert string to a Buffer

  try {
    const response = await uploadFile(blob, filename);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
})();
