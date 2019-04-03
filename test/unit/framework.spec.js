const expect = require('chai').expect;
const util   = require('./utility');

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


describe('Test framework', ( )=>{
    
    it('Should work', async () => {
        
        const fake_tester = {

            this_is_a_property : ''
            , this_is_a_non_throwing_function(){}

        };

        expect(
            util.isAsync(fake_tester.this_is_a_non_throwing_function)
        ).to.be.false;

        const functions = util.get_all_functions(fake_tester);

        expect(functions).to.include('this_is_a_non_throwing_function');
        expect(functions).not.to.include('this_is_a_property');

        let thrown = await test_throw(fake_tester.this_is_a_non_throwing_function);

        expect(thrown).to.be.false;
        
        thrown = await test_throw(util.async_function);

        expect(thrown).to.be.false;
    });
});