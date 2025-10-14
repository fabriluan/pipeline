import axios from "axios";

export async function getPresignedURL(file){
  const { data } = await axios.post(
    'https://uku2sjtnxh56bowbojuz6trtea0ghrwe.lambda-url.us-east-1.on.aws',
    { filename: file.name }
  );

  return data.signedUrl;
}