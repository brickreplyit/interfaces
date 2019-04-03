
async function async_function() {}

module.exports = {

    get_all_functions(obj) {

        let props = [];

        const target = obj;
    
        while (null != Object.getPrototypeOf(obj) ) {
                        
            //if('object' === typeof obj)
            //    break;

            props = props.concat(Object.getOwnPropertyNames(obj));

            obj = Object.getPrototypeOf(obj);

        }
    
        return props.sort().filter(function(e, i, arr) { 
            
            if('constructor' === e)
                return false;

            if (e != arr[i+1] && typeof target[e] === 'function') 
                return true;

            return false;
        });
    }

    , async_function
    
    , isAsync(func)
    {
        //const AsyncFunction = (async () => {}).constructor;
        const AsyncFunction = (async_function).constructor;

        return (func instanceof AsyncFunction);
    }

};