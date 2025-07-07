it( 'test', ()=>{
    cy.visit('https://www.geonex.site/');

    cy.wait(2000);
     
    cy.get(':nth-child(6) > .bg-blue-600').click();
    cy.wait(2000);

    cy.fixture('login').then((user) => {
        cy.get('#email').type(user.email);
        cy.get('#password').type(user.password);
    });

    cy.get('.bg-gray-900').click();

    cy.get('.mx-4').click();  //logout successfully
})