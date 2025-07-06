it( 'test', ()=>{
    cy.visit('https://www.geonex.site/');
     
    cy.get(':nth-child(6) > .bg-blue-600').click();

    cy.get('#email').type('e20242@eng.pdn.ac.lk');

    cy.get('#password').type('malinga123');

    cy.get('.bg-gray-900').click();

    cy.get('.mx-4').click();  //logout successfully
})