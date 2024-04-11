
function uploadToS3(image,filename){
  const BUCKET_NAME=process.env.BUCKET_NAME;
  const IAM_USER_KEY=process.env.IAM_USER_KEY
  const IAM_USER_SECRET=process.env.IAM_USER_SECRET
  
  let s3bucket= new AWS.S3({
      accessKeyId:IAM_USER_KEY,
      secretAccessKey:IAM_USER_SECRET
  })

  let params={
      Bucket:BUCKET_NAME,
      Key:filename,
      Body:image,
      ACL:'public-read',
      ContentType: "image/jpeg"
  }
  return new Promise((resolve,reject)=>{
      s3bucket.upload(params,(err,s3response)=>{
          if(err){
              console.log(err,'something went wrong in aws')
              reject(err)
          }else{
              console.log('success',s3response)
              resolve(s3response.Location)
          }
      })

  })
}