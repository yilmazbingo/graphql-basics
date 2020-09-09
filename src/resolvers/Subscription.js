const Subscription={
    // unlike query and mutation resolver is not a method. it is an object
    // we define a method inside the object
    // this method will be run everytime someone is suscribed to
    // ctx is where the shared data is stored
        
    comment:{
        subscribe(parent,{postId},{db,pubsub},info){
            const post=db.posts.find((post)=>post.id===postId && post.published)
            if(!post){
                throw new Error("Post not found")
            }
            // we will be publishing the comment when it is created inside the mutation
            return pubsub.asyncIterator(`comment ${postId}`)
            
        }
    },

    post:{
        subscribe(parent,{id},{pubsub,db},info){
            
            return pubsub.asyncIterator("post")

        }
    },
    

}

export {Subscription as default}