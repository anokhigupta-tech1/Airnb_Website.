const cloudinary=require('cloudinary').v2
const {CloudinaryStorage}=require("multer-storage-cloudinary")

 cloudinary.config({ 
        cloud_name: process.env.Cloud_name, 
        api_key: process.env.API_key, 
        api_secret: process.env.API_secret // Click 'View API Keys' above to copy your API secret
    });

    const storage=new CloudinaryStorage({
        cloudinary:cloudinary,params:{
            folder:"wonderlust_gup",
            
    allowed_formats: ["png", "jpg", "jpeg"],  // <-- use this
  }
});

          
    module.exports={
        cloudinary,
        storage,
    }