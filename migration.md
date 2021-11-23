##################################################
Photographer
npx sequelize-cli model:generate --name Photographer --attributes full_name:string,avatar_url:string,avatar_public_id:string,instagram:string,status:boolean

Image
npx sequelize-cli model:generate --name Image --attributes title:string,description:string,url:string,public_id:string,photographer_id:string,status:boolean
##################################################
