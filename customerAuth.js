

var passport = require('passport'),
       LocalStrategy = require('passport-local').Strategy,
       cUser = {
         // This a hard-coded user
           _id: 1,
           username: 'customerTest',
           email: 'testCustomer@bookstore.com',
           password: 'customerPassword'
       };

        global.authenticateCustomer = false;

   // Register a login strategy
   passport.use('/customers/login', new LocalStrategy(
       function(username, password, done) {
         // checks against hardcoded user (replace with db data)
           if(username === cUser.username && password === cUser.password) {
             authenticateCustomer = true;

               return done(null, cUser);
           }
           else {
               done(null, false, { message: 'Invalid username and password.' });
           }
       }
   ));

   // Used to store user info into session
   passport.serializeUser(function(cUser, done) {
     done(null, cUser._id);
   });

   // Used to retrieve user from session
   passport.deserializeUser(function(id, done) {
     // here the user should be queried against db using the id
       done(null, cUser);
   });

   module.exports = passport;
