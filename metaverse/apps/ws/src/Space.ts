import { PrismaClient } from "@prisma/client"
 const client = new PrismaClient()

export class SpaceCache{
    private space:Map<string,any> = new Map();
    private cacheTTL:number = 60*60*1000;
    private lastUpdate:Map<string,number> = new Map();
    private static instance: SpaceCache;
    public static getInstance(){
        if(!this.instance){
            this.instance=new SpaceCache();
        }
        return this.instance;
    }
    async getSpace(spaceId:string):Promise<any>{
        const now =Date.now();
        const cachedSpace = this.space.get(spaceId);
        const lastUpdate = this.lastUpdate.get(spaceId) ||0;
        
        // If space exists in cache and hasn't expired
        if(cachedSpace && now - lastUpdate < this.cacheTTL){
           console.log(`cache hit for space ${spaceId}`);
            return cachedSpace;
        }
        //fetch space from the database
        console.log(`fetching space ${spaceId} from the database`);
        const space = await client.space.findUnique({
            where: {
                id: spaceId
            },include:{
                elements:{
                    include:{
                        element:true
                    }
                }
            }
        })
        if(space){
            this.space.set(spaceId,space);
            this.lastUpdate.set(spaceId,now);
            return space;
        }
    }
    invalidateCache(spaceId:string){
        this.space.delete(spaceId);
        this.lastUpdate.delete(spaceId);
    }
}