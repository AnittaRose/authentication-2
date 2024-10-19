const dayjs = require('dayjs');
const fs = require('fs');

exports.fileUpload = async function (file, directory){

    return new Promise ((resolve ,reject)=>{
        try {
            
            let mime_type = file.split(';')[0].split(":")[1].split('/')[1];
            console.log("mime_type : ", mime_type);

            if(mime_type === "png" || "jpeg" || "jpg" || "mp4" || "pdf") {
                console.log("Allowed file type...");

                console.log("random number : ", String(Math.floor(Math.random()*100)));
                console.log("dayjs() : ", dayjs());

                let file_name = dayjs() + String(Math.floor(Math.random()*100))  + "." + mime_type;;
                console.log("file_name : ", file_name);

                
                let upload_path = `uploads/${directory}`;
                console.log("upload_path : ", upload_path);

                let base64 = file.split(';base64,')[1];
                // console.log("base64 : ", base64);

                fs.mkdir(upload_path, {recursive : true}, (err) => {

                    if(err) {
                        console.log("err : ", err);
                        reject(err.message ? err.message : err);
                    }else {
                        let upload_path = `uploads/${directory}/${file_name}`;
                        console.log("upload_path : ", upload_path);
                    }
                }) 
                
                fs.mkdir(upload_path, {recursive : true}, (err) => {
                    if(err) {
                        console.log("err : ", err);
                        reject(err.message ? err.message : err);
                    }else {
                        let upload_path = `uploads/${directory}/${file_name}`;
                        console.log("upload_path : ", upload_path);

                        fs.writeFile(
                            upload_path,
                            base64,
                            {encoding : "base64"},
                            function(err) {
                                if(err) {
                                    console.log("err : ", err);
                                    reject(err.message ? err.message : err);
                                }else {
                                    resolve(upload_path);
                                }
                            }
                        )
                    }
                })




            }else {
                console.log("Invallid file type ")
                reject("File size up to 100mb and Formats .png, .jpeg, .jpg, .mp4, .pdf are only allowed");
            }


        } catch (error) {
            console.log("error",error);
            reject(error.message ? error.message : error);
        }

    })
    
    
}