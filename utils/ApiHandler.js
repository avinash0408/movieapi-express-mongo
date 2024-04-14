class ApiHandler{
    constructor(query,reqQuery){
        this.query = query;
        this.reqQuery = reqQuery;
    }

    filter(){
        let queryStr = JSON.stringify(this.reqQuery);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g,(match)=>`$${match}`);
        const queryObj = JSON.parse(queryStr);
        delete queryObj.sort;
        delete queryObj.fields;
        delete queryObj.page;
        delete queryObj.limit;
        this.query = this.query.find(queryObj);

        return this;
    }

    sort(){
        if(this.reqQuery.sort){
            const sortBy = this.reqQuery.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }else{
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields(){
        if(this.reqQuery.fields){
            const fields = this.reqQuery.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }

        return this;
    }

    pagination(){
        const page = this.reqQuery.page*1 || 1;
        const limit = this.reqQuery.limit*1 || 10;
        // page 1 : 1-10, page 2 : 11-20, page 3: 21 -30
        const skip = (page-1)*limit;
        this.query = this.query.skip(skip).limit(limit);

        // if(this.reqQuery.page){
        //     const moviesCount =  movieModel.countDocuments();
        //     if(skip >= moviesCount){
        //         throw new Error("Page not found!");
        //     }
        // }

        return this;
    }
}

module.exports = ApiHandler;