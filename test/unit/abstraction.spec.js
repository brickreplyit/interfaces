const expect = require('chai').expect;
const util   = require('./utility');
const abstractions = require('../../lib/abstraction/Index');

async function test_throw(func)
{
    let thrown = false;

    try{
        if(util.isAsync(func))
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

describe('All abstraction should throw', () => {
   
    Object.keys(abstractions).forEach((abs) => {
        describe(`${abs}`, () => {
            const target = new abstractions[abs](); 

            const func = util.get_all_functions(target);

            func.forEach((f) => {

                it('interface method ' + f + ' should throw', async () => {

                    const func = target[f];

                    const thrown = await test_throw(func);

                    expect(thrown).to.be.true;

                });

            });
        });
    });
});





