const expect = require('chai').expect;
const util   = require('./utility');



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

        let thrown = await util.test_throw(fake_tester.this_is_a_non_throwing_function);

        expect(thrown).to.be.false;
        
        thrown = await util.test_throw(util.async_function);

        expect(thrown).to.be.false;
    });
});