import z from "zod"

export const SigupScheme =z.object({
  username :z.string().email(),
  password :z.string().min(8).max(20),
  type:z.enum(["user","admin"])
})

export const SigninScheme = z.object({
  username : z.string().email(),
  password : z.string().min(8).max(20)
})

export const UpdateMetadataScheme = z.object({ 
    avatarId :z.string()
})

export const CreateSpaceScheme = z.object({
    name :z.string(),
    dimensions:z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    mapId:z.string().optional()
 })

 export const AddElementScheme = z.object({
    spaceId :z.string(),
    elementId :z.string(),
    x:z.number(),
    y:z.number()
 })
export const DeleteElementSchema = z.object({
   
    id :z.string()
 
})
 export const CreateElementScheme = z.object({
     imageUrl :z.string(),
     width:z.number(),
     height:z.number(),
     static:z.boolean()
 })

 export const UpdateElementScheme = z.object({
    imageUrl :z.string(),
 })
 export const CreateAvatarScheme=z.object({
    name:z.string(),
    imageUrl:z.string(),
 })

export const CreateMapSchema = z.object({
    name:z.string(),
    thumbnail:z.string(),
    dimensions:z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    defaultElements:z.array(z.object({
        elementId:z.string(),
        x:z.number(),
        y:z.number()
    }))
})