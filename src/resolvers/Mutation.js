import { v4 as uuidv4 } from 'uuid'

const Mutation={
    //********************          USER             *******************************
    // some() returns boolean but find() returns the first value
    createUser(parent,args,{db},info){
        const emailTaken=db.users.some(user=>user.email===args.data.email)
        if (emailTaken){
            throw new Error("Email is already taken")
        }
        const user={
            id:uuidv4(),
            ...args.data
        }
        db.users.push(user)

        return user

    },

    // we have to delete all posts and comments belong to the deleted user
    deleteUser(parent,args,{db},info){
        // strings have indexOf()
        const userIndex=db.users.findIndex(user=>user.id===args.id)
        if(userIndex===-1){
            throw new Error("User not found")
        }
        // splice() returns all the deleted items in an array
        const deletedUser=db.users.splice(userIndex,1)
        db.posts.filter(post=>{
            // filter() filters out the postId if condition meets.
            // !match means return a new array where post.auhor!==args.id
            // instead of args.id I could use deletedUser[0].id
            const match=post.author===args.id
            // if we find a match then we delete the comments
            if(match){
                db.comments=db.comments.filter(comment=>comment.id!==post.id)
            }
            return !match
        })
        // comment is related to post and author
        // we deleted the related post inside the posts.filter, now we delete the author
        db.comments=db.comments.filter(comment=>comment.author!==args.id)
        return deletedUser[0]  
    },
    updateUser(parent,args,{db},info){
        // {id,data} are passed as operational args
        const {id,data}=args
        let user=db.users.find(user=>user.id===id)
        if(!user){
            throw new Error("user does not exist")
        }
    //    always check the inputs. since all properties are optional, we are checking if they are passed
        if(typeof data.email==="string"){
            // /some() returns boolean
            const emailTaken=db.users.some(user=>user.email===data.email)
            if(emailTaken){
                throw new Error("Email already taken")
            }
            user.email=data.email
        }
        if(typeof data.name==="string"){
            user.name=data.name
        }
        // "null" can be passed to and it wont throw an error.
        // type of null is an object. for empty object we use null.
        if(typeof data.age!==undefined ){
            user.age=data.age

        }
        return user

    },

    //****************             POST           ********************
    createPost(parent,args,{db,pubsub},info){
        const userExists=db.users.some(user=>user.id===args.data.author)
        if(!userExists){
            throw new Error("user does not exist")
        }
        const post={
            id:uuidv4(),
            ...args.data
        }
        db.posts.push(post)
        if(args.data.published){
            // we are returning PostSubscriptionPayload input type
            pubsub.publish("post",{post:{
                mutation:"CREATED",
                data:post
            }})

        }
        return post
    },

    deletePost(parent,args,{db,pubsub},info){
        const postIndex=db.posts.findIndex(post=>post.id===args.id)
        // findIndex() returns -1 if nothing found
        if(postIndex===-1){
            throw new Error("Post Not Found")
        }
        // array destructuring
        const [deletedPost]=db.posts.splice(postIndex,1)
        db.comments=db.comments.filter(comment=>comment.post!==args.id)
        if(deletedPost.published){
            pubsub.publish('post',{post:{
                mutation:"DELETED",
                data:deletedPost
            }})
        }
        // splice() returns array
        return deletedPost

    },

    updatePost(parent,args,{db,pubsub},info){
        const {id,data}=args
        let post=db.posts.find(post=>post.id===id)
        // if original post published converted to false, we send "DELETED"
        // if original post published converted to true, we send "CREATED"
        const originalPost={...post}
        if(!post){
            throw new Error("Post does not exist")
        }
        if(typeof data.title==="string"){
            post.title=data.title
        };
        if(typeof data.body==="string"){
            post.body=data.body
        }
        if(typeof data.published==="boolean"){
            post.published=data.published
            if(originalPost.published && !post.published){
                // we fire deleted event
                pubsub.publish("post",{post:{
                    mutation:"DELETED",
                data:originalPost}})
                }
                else if(!originalPost.published && post.published){
                    pubsub.publish("post",{post:{
                        mutation:"CREATED",
                        data:post

                    }})

                }else if(post.published){
                    pubsub.published("post",{post:{
                        mutation:"UPDATED",
                        data:post
                    }})

                }
        

        }
        return post
        
    },
    // **************************     COMMENT     ************************************
    createComment(parent,args,{db,pubsub},info){
        const userExists=db.users.some(user=>user.id===args.data.author)
        const postExists=db.posts.some(post=>post.id===args.data.post && post.published)
        if(!userExists || !postExists){
            throw new Error("Unable to find user and post")
        }
        
        const comment={
            id:uuidv4(),
            ...args.data
        }

        db.comments.push(comment)
        // comment belongs to a post. so we are checking the post id.
        pubsub.publish(`comment ${args.data.post}`,{comment:{
            mutation:"CREATED",
            data:comment
        }})
        return comment
    },

    deleteComment(parent,args,{db,pubsub},info){
        const commentIndex=db.comments.findIndex(comment=>comment.id===args.id)
        if(commentIndex===-1) {
            throw new Error("Comment Not Found")
        }
        // splice() returns array.
        const [deletedComment]=db.comments.splice(db.comments,1)
        pubsub.publish(`comment ${deletedComment.post}`,{comment:{
            mutation:"DELETED",
            data:deletedComment
        }})
        return deletedComment
    },
    // updatign args are optional. so we check first if any passed
    // we are passing the comment id not the post id
    updateComment(parent, args, { db,pubsub }, info) {
        const { id, data } = args;
        let comment = db.comments.find((comment) => comment.id === id);
        if (!comment) {
          throw new Error("no comment found");
        }
        if (typeof data.text === "string") {
          comment.text = data.text;

        }
        pubsub.publish(`comment ${comment.post}`,{comment:{
            mutation:"UPDATED",
            data:comment
        }})
       
        return comment;
      },

}

export {Mutation as default}