
async function async_function() {}

function isAsync(func)
{
    const AsyncFunction = (async_function).constructor;

    return (func instanceof AsyncFunction);
}

function get_all_functions(obj) {

    let props = [];

    const target = obj;

    while (null != Object.getPrototypeOf(obj) ) {
            
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


async function test_throw(func)
{
    let thrown = false;

    try{
        if(this.isAsync(func))
        {
            await func();
        }
        else
        {
            func();
        }
    }catch(err)
    {
        thrown = true;
    }

    return thrown;
}

module.exports = {
    get_all_functions
    , async_function
    , isAsync
    , test_throw
};