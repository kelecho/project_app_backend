import cloudinary from 'cloudinary'
import {v4 as uuidv4} from 'uuid'
import dotenv from 'dotenv'
dotenv.config()

// Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const subirAvatar = async (ruta) => {
  try {
    const upload = await cloudinary.v2.uploader.upload(ruta, {
      public_id: `${uuidv4()}`,
      folder: 'avatarsFinal',
    });
    return upload.secure_url;
  } catch (error) {
    return error ;
  }
};

export const subirIconoProyecto = async (ruta) => {
  try {
    const upload = await cloudinary.v2.uploader.upload(ruta, {
      public_id: `${uuidv4()}`,
      folder: "IconoDeProyectoFinal",
    });
    return upload.secure_url;
  } catch (error) {
    return error
  }
};

export const borrarImagen = async (iconoUrl) => {
  try {
    const idPublica = await iconoUrl.split("/");
    const id = await idPublica[8].split(".");
    const resultado = await cloudinary.v2.uploader.destroy(
      `${idPublica[7]}/${id[0]}`
    );
    return { status: resultado };
  } catch (error) {
    return { error: error.message };
  }
};
